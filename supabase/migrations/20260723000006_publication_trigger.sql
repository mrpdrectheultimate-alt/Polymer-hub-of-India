-- Sprint 0A-R3: Publication Integrity Trigger with External-Only Support

CREATE OR REPLACE FUNCTION public.validate_video_publication()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.status = 'published' THEN
    -- Embed Status Validation
    IF NEW.embed_status NOT IN ('working', 'blocked') THEN
      RAISE EXCEPTION 'Published video must have working or blocked embed status';
    END IF;

    -- Academic Review Validation
    IF NEW.academic_review_status NOT IN ('approved', 'approved_with_caveat') THEN
      RAISE EXCEPTION 'Published video requires academic approval (approved or approved_with_caveat)';
    END IF;

    -- Technical Automated Pings
    IF NEW.oembed_verified_at IS NULL THEN
      RAISE EXCEPTION 'Published video requires oEmbed verification timestamp';
    END IF;

    IF NEW.thumbnail_verified_at IS NULL THEN
      RAISE EXCEPTION 'Published video requires thumbnail verification timestamp';
    END IF;

    -- In-App Embed Playback Rule
    IF NEW.embed_status = 'working' AND COALESCE(NEW.manual_playback_verified, false) = false THEN
      RAISE EXCEPTION 'Working embeds require manual in-app playback verification';
    END IF;

    -- External-Only Video Rule
    IF NEW.embed_status = 'blocked' THEN
      IF NEW.youtube_url IS NULL AND NEW.canonical_url IS NULL THEN
        RAISE EXCEPTION 'External-only videos require a valid canonical URL';
      END IF;
      IF COALESCE(NEW.external_page_verified, false) = false THEN
        RAISE EXCEPTION 'External-only videos require external page verification';
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_validate_video_publication ON public.videos;

CREATE TRIGGER trg_validate_video_publication
BEFORE INSERT OR UPDATE ON public.videos
FOR EACH ROW
EXECUTE FUNCTION public.validate_video_publication();
