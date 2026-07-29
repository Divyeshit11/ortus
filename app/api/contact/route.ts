import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { name, email, subject, message } = await req.json();

  // Validation
  if (!name || !email || !message) {
    return NextResponse.json(
      { error: 'Name, email, and message are required' },
      { status: 400 }
    );
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
  }

  // Basic validation for name and message length
  if (name.length < 2) {
    return NextResponse.json({ error: 'Name must be at least 2 characters' }, { status: 400 });
  }

  if (message.length < 10) {
    return NextResponse.json({ error: 'Message must be at least 10 characters' }, { status: 400 });
  }

  try {
    // In production, integrate with email service or save to database
    // For now, we'll just log the contact form submission
    console.log('Contact form submission:', {
      name,
      email,
      subject: subject || 'No subject',
      message,
      timestamp: new Date().toISOString()
    });
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({ 
      success: true, 
      message: 'Thank you for your message. We will get back to you soon.' 
    });
  } catch (err) {
    console.error('Contact form error:', err);
    return NextResponse.json(
      { error: 'Failed to submit contact form' },
      { status: 500 }
    );
  }
}
