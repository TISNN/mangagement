// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.com/deploy/docs/projects

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

console.log("School Assistant API is running!");

serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 获取请求路径
    const url = new URL(req.url);
    const path = url.pathname.split("/").pop();

    // 根据路径处理不同的请求
    if (path === "schools") {
      // 处理学校数据请求
      return new Response(
        JSON.stringify({ message: "Schools data endpoint" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    } else if (path === "programs") {
      // 处理专业数据请求
      return new Response(
        JSON.stringify({ message: "Programs data endpoint" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // 默认响应
    return new Response(
      JSON.stringify({ message: "School Assistant API" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
