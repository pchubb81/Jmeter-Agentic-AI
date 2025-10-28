import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd want to handle this more gracefully.
  // For this context, we assume the key is present.
  console.warn("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const systemInstruction = `You are an expert JMeter performance testing engineer. Your task is to generate a complete and valid JMeter Test Plan (.jmx file format) based on the user's request. The output must be a single block of XML content. Do not include any explanatory text, markdown formatting, or code comments outside of the XML structure. The generated XML should be directly usable as a .jmx file.`;

export const generateJMeterTestPlan = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            jmxContent: {
              type: Type.STRING,
              description: "The full XML content of the JMeter .jmx test plan.",
            },
          },
          required: ["jmxContent"],
        },
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);

    if (result && typeof result.jmxContent === 'string') {
        // Basic check to see if it looks like XML
        if (result.jmxContent.startsWith('<?xml')) {
            return result.jmxContent;
        }
    }
    
    throw new Error("Invalid JMX content received from AI.");

  } catch (error) {
    console.error("Error generating JMeter test plan:", error);
    if (error instanceof Error) {
        return `Error: Failed to generate JMeter plan. ${error.message}`;
    }
    return `Error: An unknown error occurred while generating the JMeter plan.`;
  }
};
