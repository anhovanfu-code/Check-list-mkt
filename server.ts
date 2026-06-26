import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Server-side lazy initialization helper for Gemini SDK
  let aiClient: GoogleGenAI | null = null;

  function getAiClient(): GoogleGenAI {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is missing. Please add it in the Secrets panel.");
      }
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
    return aiClient;
  }

  // API route for generating content using Gemini API
  app.post("/api/generate-content", async (req, res) => {
    try {
      const { role, personnelName, topic, type } = req.body;

      if (!topic) {
        res.status(400).json({ error: "Chủ đề (topic) không được để trống." });
        return;
      }

      const ai = getAiClient();

      let systemInstruction = "Bạn là trợ lý đắc lực hỗ trợ quản lý và sáng tạo cho Nhóm Marketing và Media. Hãy đưa ra câu trả lời chi tiết bằng Tiếng Việt, bám sát chuyên môn của từng nhân sự.";
      let prompt = `Nhân sự: ${personnelName} (Vai trò: ${role})
Yêu cầu: Lên nội dung loại "${type}" cho chủ đề: "${topic}"

Hãy viết một nội dung chuyên nghiệp, sáng tạo, thực tế và có thể sử dụng ngay lập tức:
- Nếu loại là "script" (Kịch bản): Viết kịch bản video Vlog hoặc kịch bản Livestream chi tiết (gồm cảnh quay, lời thoại, ghi chú edit).
- Nếu loại là "seeding" (Mẫu tương tác): Tạo danh sách 10-15 mẫu bình luận/seeding tự nhiên, kích thích mua hàng hoặc tạo hiệu ứng đám đông cho phiên live/bài viết về chủ đề này.
- Nếu loại là "ad-copy" (Mẫu quảng cáo): Viết 3 mẫu viết bài chạy quảng cáo thu hút khách hàng (gồm tiêu đề giật tít, nội dung cốt lõi, CTA, thẻ hashtags).
- Nếu loại là "checklist" (Quy trình công việc): Lập danh sách các bước chuẩn bị kỹ thuật, sản xuất hoặc kiểm soát rủi ro chi tiết từng bước cho nhân sự này đối với chủ đề đã chọn.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ result: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ 
        error: error.message || "Đã xảy ra lỗi khi tạo nội dung với Gemini API. Vui lòng kiểm tra GEMINI_API_KEY trong cấu hình."
      });
    }
  });

  // API route to verify API Key presence
  app.get("/api/config", (req, res) => {
    res.json({
      hasApiKey: !!process.env.GEMINI_API_KEY,
    });
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
