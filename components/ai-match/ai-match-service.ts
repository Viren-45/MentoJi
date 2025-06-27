// components/ai-match/ai-match-service.ts
export interface CollectedData {
  category?: string;
  role?: string;
  challenge?: string;
  expertType?: string;
  goal?: string;
  urgency?: string;
  sessionLength?: string;
  budget?: string;
  preferences?: string;
}

export interface AIMessage {
  id: string;
  type: "ai" | "user";
  message: string;
  timestamp: Date;
}

export class AIMatchService {
  private static instance: AIMatchService;
  private conversationHistory: Array<{
    role: "system" | "user" | "assistant";
    content: string;
  }> = [];

  private constructor() {
    // Initialize with system prompt
    this.conversationHistory.push({
      role: "system",
      content: `You are a friendly and intelligent assistant on a micro-consultation platform that connects professionals with experts for 15-30 minute video consultations.
  
  Start by greeting the user with a short, personal message like:  
  "Hey there! I'd love to help you find the right expert. Can I ask you a few quick questions to get a better idea of what you need help with?"
  
  Your goal is to ask a small set of questions to understand the user's situation and match them with a suitable expert.
  
  Ask 1–2 questions per message to keep things efficient but conversational. Use natural language, and offer examples when needed to guide unclear answers.
  
  You must collect the following information:
  1. **Category** — What topic do they need help with? (e.g., Marketing, Legal, Product Strategy, etc.)
  2. **Role** — What best describes their role or situation? (e.g., Startup founder, freelancer, career switcher)
  3. **Challenge** — Brief description of their specific challenge
  4. **Expert Type** — What kind of expert do they want to talk to (if known)? (e.g., startup mentor, UX designer)
  5. **Goal** — What do they want out of the session? (e.g., validation, next steps, decision help)
  6. **Urgency** — How soon do they want to talk to someone? (e.g., today, within 3 days)
  7. **Session Length** — Preferred session duration (15 or 30 minutes)
  8. **Budget** — How much are they willing to pay?
  9. **Expert Preferences (optional)** — Any preferences like background, industry, location, etc.
  
  Once all information is gathered, summarize the answers clearly in a readable, structured format like this:
  
  Here's what I understood about your needs:
  Category: Product Strategy
  Role: Startup Founder
  Challenge: Validating your SaaS idea
  Expert Type: Startup Mentor
  Goal: Validation
  Urgency: Within 2 days
  Session Length: 15 minutes
  Budget: $40
  Preferences: None
  
  Then say:
  "Did I get everything right? You can confirm or let me know if you'd like to change anything."
  
  If the user wants to change a specific answer (e.g., increase budget), update that field only and show the **entire updated summary again** before moving forward.
  
  Do not proceed to showing expert matches or giving recommendations — just gather and confirm structured client intent for now.`,
    });
  }

  public static getInstance(): AIMatchService {
    if (!AIMatchService.instance) {
      AIMatchService.instance = new AIMatchService();
    }
    return AIMatchService.instance;
  }

  public async sendMessage(userMessage: string): Promise<string> {
    // Add user message to history
    this.conversationHistory.push({
      role: "user",
      content: userMessage,
    });

    try {
      const response = await fetch("/api/ai-match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: this.conversationHistory,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      const data = await response.json();
      const aiResponse = data.message;

      // Add AI response to history
      this.conversationHistory.push({
        role: "assistant",
        content: aiResponse,
      });

      return aiResponse;
    } catch (error) {
      console.error("Error calling AI service:", error);
      return "I'm sorry, I'm having trouble connecting right now. Could you try again?";
    }
  }

  public async getInitialMessage(): Promise<string> {
    try {
      const response = await fetch("/api/ai-match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: this.conversationHistory,
          isInitial: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get initial AI response");
      }

      const data = await response.json();
      const aiResponse = data.message;

      // Add AI response to history
      this.conversationHistory.push({
        role: "assistant",
        content: aiResponse,
      });

      return aiResponse;
    } catch (error) {
      console.error("Error getting initial message:", error);
      return "Hey there! I'd love to help you find the right expert. Can I ask you a few quick questions to get a better idea of what you need help with?";
    }
  }

  public parseCollectedData(aiResponse: string): CollectedData | null {
    // Look for the structured summary in the AI response
    const summaryMatch = aiResponse.match(
      /Here's what I understood about your needs:(.*?)(?:Did I get everything right|$)/
    );

    if (!summaryMatch) return null;

    const summaryText = summaryMatch[1];
    const data: CollectedData = {};

    // Parse each field
    const patterns = {
      category: /Category:\s*([^\n]+)/i,
      role: /Role:\s*([^\n]+)/i,
      challenge: /Challenge:\s*([^\n]+)/i,
      expertType: /Expert Type:\s*([^\n]+)/i,
      goal: /Goal:\s*([^\n]+)/i,
      urgency: /Urgency:\s*([^\n]+)/i,
      sessionLength: /Session Length:\s*([^\n]+)/i,
      budget: /Budget:\s*([^\n]+)/i,
      preferences: /Preferences:\s*([^\n]+)/i,
    };

    for (const [key, pattern] of Object.entries(patterns)) {
      const match = summaryText.match(pattern);
      if (match) {
        data[key as keyof CollectedData] = match[1].trim();
      }
    }

    return Object.keys(data).length > 0 ? data : null;
  }

  public isConversationComplete(aiResponse: string): boolean {
    return aiResponse.includes("Here's what I understood about your needs:");
  }

  public reset(): void {
    this.conversationHistory = [
      {
        role: "system",
        content: this.conversationHistory[0].content, // Keep system prompt
      },
    ];
  }
}
