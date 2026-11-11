import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const NEW_NOTICE_KEY = "new_page_notice";
export type NewPageNotice = { title: string; message: string };
export const DEFAULT_NEW_NOTICE: NewPageNotice = {
  title: "Live explorations in progress",
  message:
    "This page shows ongoing live explorations and products being tested this year. Once each one is done, it moves to its respective section. Stay in touch, connect with us, and drop your thoughts below.",
};

export function useNewPageNotice() {
  const [notice, setNotice] = useState<NewPageNotice>(DEFAULT_NEW_NOTICE);
  useEffect(() => {
    let active = true;
    const load = async () => {
      const { data } = await supabase.from("about_content").select("content").eq("section_key", NEW_NOTICE_KEY).maybeSingle();
      if (active && data?.content) setNotice({ ...DEFAULT_NEW_NOTICE, ...(data.content as Partial<NewPageNotice>) });
    };
    load();
    const ch = supabase.channel("new-page-notice")
      .on("postgres_changes", { event: "*", schema: "public", table: "about_content" }, load).subscribe();
    return () => { active = false; supabase.removeChannel(ch); };
  }, []);
  return notice;
}
