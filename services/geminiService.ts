import { GoogleGenAI, Modality } from "@google/genai";
import { AspectRatio, VectorShape } from "../types";

// Initialize client cleanly.
// API Key must be provided via process.env.API_KEY as per guidelines.
const createClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateImage = async (prompt: string, aspectRatio: AspectRatio = '1:1'): Promise<string> => {
  const ai = createClient();
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: aspectRatio,
      },
    });

    if (response.generatedImages?.[0]?.image?.imageBytes) {
      return `data:image/jpeg;base64,${response.generatedImages[0].image.imageBytes}`;
    }
    throw new Error("No image generated");
  } catch (error) {
    console.error("Gemini Image Generation Error:", error);
    throw error;
  }
};

export const generateFont = async (text: string, style: string): Promise<string> => {
  const ai = createClient();
  try {
    // Crafted prompt for better typography results
    const fullPrompt = `Typography design of the word "${text}" in a ${style} style. High resolution, vector graphic style, isolated on a solid neutral background, clean sharp edges, professional font design.`;

    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: fullPrompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '16:9', // Wider aspect ratio often better for text
      },
    });

    if (response.generatedImages?.[0]?.image?.imageBytes) {
      return `data:image/jpeg;base64,${response.generatedImages[0].image.imageBytes}`;
    }
    throw new Error("No font image generated");
  } catch (error) {
    console.error("Gemini Font Generation Error:", error);
    throw error;
  }
};

export const editImage = async (imageBase64: string, prompt: string): Promise<string> => {
  const ai = createClient();
  try {
    // Clean base64 string if it contains data URI prefix
    const cleanBase64 = imageBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: 'image/png', // Assuming PNG for simplicity in canvas exports often
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (part && part.inlineData && part.inlineData.data) {
        return `data:image/png;base64,${part.inlineData.data}`;
    }
    throw new Error("No edited image returned");

  } catch (error) {
    console.error("Gemini Image Editing Error:", error);
    throw error;
  }
};

export const vectorizeImage = async (imageBase64: string): Promise<VectorShape[]> => {
    const ai = createClient();
    const cleanBase64 = imageBase64.replace(/^data:image\/(png|jpeg|jpg|webp|svg\+xml);base64,/, '');

    const prompt = `You are an expert vector tracer.
    Trace the high-contrast shapes in this image and convert them into standard SVG paths.
    Focus on accuracy for typography or main graphical elements. Ignore subtle background noise.
    Return ONLY a JSON object with a single key "paths", which is an array of strings.
    Each string must be a valid SVG 'd' attribute (path data).
    Example format: { "paths": ["M10 10 L50 10 L50 50 Z", "C100 100 150 100 150 150"] }`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { inlineData: { data: cleanBase64, mimeType: 'image/png' } },
                    { text: prompt }
                ]
            },
            config: {
                responseMimeType: 'application/json'
            }
        });

        const text = response.text;
        if (!text) throw new Error("No response from AI");

        const json = JSON.parse(text);
        if (!json.paths || !Array