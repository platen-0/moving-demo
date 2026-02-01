import { NextRequest, NextResponse } from 'next/server';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  context: {
    moveDate?: string;
    homeSize?: string;
    fromCity?: string;
    toCity?: string;
    totalItems?: number;
    specialItemsCount?: number;
    currentStep?: string;
  };
}

const FALLBACK_RESPONSES: Record<string, string> = {
  tip: 'A standard tip for movers is $4-5 per hour per mover for a local move, or $5-10 per mover for long-distance. A helpful rule of thumb is 15-20% of the total moving cost.',
  day: "Midweek moves (Tuesday-Thursday) are typically cheapest and movers are less rushed. End of month is busiest due to lease cycles. If you're flexible, you may save 20-30% by avoiding peak times.",
  insurance:
    "Basic carrier liability is included (usually $0.60/lb), but it won't cover the full value of damaged items. Full value protection costs extra but covers repair or replacement at current market value. Consider it especially for valuable items.",
  book: "For local moves, book 2-4 weeks ahead. For long-distance or peak season (summer, end of month), book 6-8 weeks out. Last-minute moves are possible but may cost 20-30% more.",
  cost: "Moving costs depend on distance, volume (rooms/items), special items, and services needed. Local moves average $300-1,500 while long-distance can run $2,000-5,000+. Get multiple quotes to compare.",
  default:
    "That's a great question about your move. I'd recommend discussing specifics with the matched movers who can give you accurate quotes based on your complete moving profile.",
};

function getFallbackResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('tip')) return FALLBACK_RESPONSES.tip;
  if (lower.includes('day') || lower.includes('time') || lower.includes('when'))
    return FALLBACK_RESPONSES.day;
  if (lower.includes('insurance') || lower.includes('protect'))
    return FALLBACK_RESPONSES.insurance;
  if (lower.includes('book') || lower.includes('advance') || lower.includes('ahead'))
    return FALLBACK_RESPONSES.book;
  if (lower.includes('cost') || lower.includes('price') || lower.includes('how much'))
    return FALLBACK_RESPONSES.cost;
  return FALLBACK_RESPONSES.default;
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { messages, context } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'No messages provided' } },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (apiKey && apiKey !== 'sk-ant-...') {
      try {
        const moveContext = [
          context.fromCity && context.toCity ? `Moving from ${context.fromCity} to ${context.toCity}` : null,
          context.homeSize ? `Home size: ${context.homeSize}` : null,
          context.totalItems ? `${context.totalItems} furniture items` : null,
          context.specialItemsCount ? `${context.specialItemsCount} special items` : null,
          context.moveDate ? `Move date: ${context.moveDate}` : null,
        ]
          .filter(Boolean)
          .join(', ');

        const systemPrompt = `You are a helpful moving assistant on a moving comparison website. ${
          moveContext ? `The user's move details: ${moveContext}.` : ''
        }

Be helpful, friendly, and concise (2-4 sentences max). You can explain moving best practices, tips, and general pricing guidance but cannot guarantee specific rates. If asked about specific movers, say we'll show matched options after they complete their profile. Provide practical moving advice. Do not use markdown formatting.`;

        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 300,
            system: systemPrompt,
            messages: messages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const responseText = data.content?.[0]?.text;
          if (responseText) {
            return NextResponse.json({ success: true, response: responseText });
          }
        }
      } catch {
        // Fall through to fallback
      }
    }

    // Fallback response
    const lastMessage = messages[messages.length - 1].content;
    const response = getFallbackResponse(lastMessage);
    return NextResponse.json({ success: true, response });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Chat failed' } },
      { status: 500 }
    );
  }
}
