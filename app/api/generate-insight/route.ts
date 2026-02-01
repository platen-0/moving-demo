import { NextRequest, NextResponse } from 'next/server';

interface MoveInsightRequest {
  rooms: Array<{
    name: string;
    furnitureCount: number;
  }>;
  specialItems: string[];
  services: string[];
  homeSize: string;
  type: 'summary' | 'tips';
}

function generateFallbackInsight(data: MoveInsightRequest): string {
  const totalFurniture = data.rooms.reduce((sum, r) => sum + r.furnitureCount, 0);
  const hasSpecialItems = data.specialItems.length > 0;
  const hasServices = data.services.length > 0;

  // Different insight templates based on scenario
  if (hasSpecialItems && data.specialItems.length >= 2) {
    return `With ${data.specialItems.length} special items including ${data.specialItems.slice(0, 2).join(' and ')}, you'll want movers experienced in handling valuable pieces. The right team will have proper equipment and insurance coverage for these items.`;
  }

  if (totalFurniture >= 30) {
    return `Your ${data.homeSize} with ${totalFurniture} furniture items is a substantial move. Professional movers typically allocate 4-6 hours for moves this size. Getting quotes from multiple movers ensures competitive pricing.`;
  }

  if (hasServices) {
    return `Adding ${data.services.join(' and ')} to your move is a smart choice. These services typically save homeowners 2-3 days of work and reduce the risk of damage during transit.`;
  }

  if (data.rooms.length <= 2) {
    return `Your ${data.homeSize} move with ${totalFurniture} items is manageable but still benefits from professional help. Most moves this size complete in 2-4 hours with an experienced crew.`;
  }

  return `Your ${data.rooms.length}-room move with ${totalFurniture} items is well-organized. Comparing quotes from multiple movers typically saves 15-25% versus booking the first option you find.`;
}

export async function POST(request: NextRequest) {
  try {
    const body: MoveInsightRequest = await request.json();

    // Try Claude API if key is available
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (apiKey && apiKey !== 'sk-ant-...') {
      try {
        const moveSummary = [
          `Home size: ${body.homeSize}`,
          `Rooms: ${body.rooms.map((r) => `${r.name} (${r.furnitureCount} items)`).join(', ')}`,
          body.specialItems.length > 0 ? `Special items: ${body.specialItems.join(', ')}` : null,
          body.services.length > 0 ? `Services: ${body.services.join(', ')}` : null,
        ]
          .filter(Boolean)
          .join('\n');

        const prompt =
          body.type === 'summary'
            ? `Given this moving profile:\n${moveSummary}\n\nWrite 2-3 sentences of insight for someone planning this move. Focus on what makes their move unique and one practical tip. Keep it conversational and helpful. No jargon. No markdown.`
            : `Given this moving profile:\n${moveSummary}\n\nWrite 2-3 sentences with a specific tip for their move. Be practical and actionable. Keep it conversational. No markdown.`;

        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 200,
            messages: [{ role: 'user', content: prompt }],
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const insight = data.content?.[0]?.text;
          if (insight) {
            return NextResponse.json({ success: true, insight });
          }
        }
      } catch {
        // Fall through to fallback
      }
    }

    // Fallback: generate insight locally
    const insight = generateFallbackInsight(body);
    return NextResponse.json({ success: true, insight });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to generate insight' } },
      { status: 500 }
    );
  }
}
