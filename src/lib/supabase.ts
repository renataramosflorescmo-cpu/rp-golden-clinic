import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://bggqklkeqdmkefvrjuka.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnZ3FrbGtlcWRta2VmdnJqdWthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5ODIzOTYsImV4cCI6MjA5MDU1ODM5Nn0.mV0Hq6vOgyEKZQk5379_UoBU96vnfWl-VCFgT0DHiZs";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const STORAGE_BUCKET = "blog-images";

export function getImageUrl(path: string) {
  return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${path}`;
}
