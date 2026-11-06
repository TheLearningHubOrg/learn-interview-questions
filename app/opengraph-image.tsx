import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'InterviewHub PRO - 1,500+ Master Technical Interview Questions';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#090a0f',
          backgroundImage: 'radial-gradient(circle at 50% 20%, rgba(124, 58, 237, 0.25) 0%, transparent 60%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
          padding: '60px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px',
            padding: '8px 20px',
            borderRadius: '9999px',
            border: '1px solid rgba(139, 92, 246, 0.4)',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
          }}
        >
          <span style={{ fontSize: '18px', color: '#c4b5fd', fontWeight: 600 }}>
            ★ The 2026 Master Technical Interview Edition
          </span>
        </div>

        <h1
          style={{
            fontSize: '64px',
            fontWeight: 800,
            textAlign: 'center',
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            margin: '0 0 20px 0',
            background: 'linear-gradient(to right, #ffffff, #c4b5fd, #818cf8)',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          InterviewHub PRO
        </h1>

        <p
          style={{
            fontSize: '24px',
            color: '#94a3b8',
            textAlign: 'center',
            maxWidth: '900px',
            lineHeight: 1.5,
            margin: '0 0 40px 0',
          }}
        >
          1,500+ Battle-Tested Questions & Code Examples Across Angular 2-19, React 18/19, JavaScript Internals, Databases, Python, Node.js, AWS Cloud, and DSA.
        </p>

        <div
          style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
          }}
        >
          {['Angular & Signals', 'React & Next.js', 'Core JS (518 Qs)', 'AWS Cloud', 'Databases'].map(
            (item) => (
              <div
                key={item}
                style={{
                  padding: '10px 18px',
                  borderRadius: '12px',
                  backgroundColor: '#121520',
                  border: '1px solid #1e2330',
                  color: '#e2e8f0',
                  fontSize: '16px',
                  fontWeight: 600,
                }}
              >
                {item}
              </div>
            )
          )}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

