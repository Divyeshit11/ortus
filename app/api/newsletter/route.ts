import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
  }

  try {
    // In production, integrate with email service like Mailchimp, SendGrid, etc.
    // For now, we'll just log the subscription
    console.log('Newsletter subscription:', email);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully subscribed to newsletter' 
    });
  } catch (err) {
    console.error('Newsletter subscription error:', err);
    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter' },
      { status: 500 }
    );
  }
}
