// scripts/inspect_db_schema.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function inspect() {
  console.log('Inspecting Supabase Tables and Schemas...');
  
  // Test lessons
  const { data: lesson, error: err1 } = await supabase.from('lessons').select('*').limit(1);
  if (err1) {
    console.error('Error fetching lesson:', err1);
  } else {
    console.log('Lesson columns:', Object.keys(lesson[0] || {}));
  }

  // Test videos
  const { data: video, error: err2 } = await supabase.from('videos').select('*').limit(1);
  if (err2) {
    console.error('Error fetching video:', err2);
  } else {
    console.log('Video columns:', Object.keys(video[0] || {}));
  }

  // Test lesson_videos
  const { data: lessonVideo, error: err3 } = await supabase.from('lesson_videos').select('*').limit(1);
  if (err3) {
    console.log('lesson_videos table does not exist or threw error:', err3.message);
  } else {
    console.log('lesson_videos columns:', Object.keys(lessonVideo[0] || {}));
  }

  // Test quizzes
  const { data: quiz, error: err4 } = await supabase.from('quizzes').select('*').limit(1);
  if (err4) {
    console.log('quizzes table error:', err4.message);
  } else {
    console.log('Quiz columns:', Object.keys(quiz[0] || {}));
  }
}

inspect();
