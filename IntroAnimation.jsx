import React, { useEffect, useState, useRef } from 'react';

const PARTICLE_COLORS = ['#0A317B', '#1A9C9B', '#FA9C16'];
const WORD = 'Edutech';
const LETTER_BASE_DELAY = 2.1;
const LETTER_STEP = 0.045;

export default function IntroAnimation({ onReveal, onComplete, siteReady }) {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const edutechElRef = useRef(null);
  const particlesElRef = useRef(null);

  // Keep latest callbacks in refs so parent re-renders never restart the intro
  const onRevealRef = useRef(onReveal);
  const onCompleteRef = useRef(onComplete);
  onRevealRef.current = onReveal;
  onCompleteRef.current = onComplete;

  useEffect(() => {
    // Build letters
    if (edutechElRef.current) {
      edutechElRef.current.innerHTML = '';
      [...WORD].forEach((ch, i) => {
        const span = document.createElement('span');
        span.className = 'cci-letter';
        span.style.setProperty('--ldelay', (LETTER_BASE_DELAY + i * LETTER_STEP) + 's');
        span.textContent = ch;
        edutechElRef.current.appendChild(span);
      });
    }

    // Build particle burst
    if (particlesElRef.current) {
      particlesElRef.current.innerHTML = '';
      const count = 14;
      for (let i = 0; i < count; i++) {
        const span = document.createElement('span');
        span.className = 'cci-particle';
        const angle = (360 / count) * i + (Math.random() * 14 - 7);
        const dist = 70 + Math.random() * 90;
        const size = 4 + Math.random() * 5;
        const color = PARTICLE_COLORS[i % PARTICLE_COLORS.length];
        const delay = 1.42 + Math.random() * 0.05;
        span.style.setProperty('--angle', angle + 'deg');
        span.style.setProperty('--dist', dist + 'px');
        span.style.setProperty('--size', size + 'px');
        span.style.setProperty('--pcolor', color);
        span.style.setProperty('--pdelay', delay + 's');
        particlesElRef.current.appendChild(span);
      }
    }

    // Animation is fully finished at ~3.4s. Only now let the (heavy) site mount
    // behind the still-opaque intro, so its work can't freeze the animation.
    const revealTimer = setTimeout(() => onRevealRef.current?.(), 3500);

    // Safety net: never let the intro hang, whatever happens
    const failsafe = setTimeout(() => onCompleteRef.current?.(), 7000);

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(failsafe);
    };
  }, []);

  // Once the site has mounted and painted underneath, fade the intro away
  useEffect(() => {
    if (!siteReady) return;
    let raf1, raf2, doneTimer;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        setIsFadingOut(true);
        doneTimer = setTimeout(() => onCompleteRef.current?.(), 550);
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      clearTimeout(doneTimer);
    };
  }, [siteReady]);

  return (
    <div 
      id="cc-intro"
      className={`fixed inset-0 z-[9999] bg-white flex items-center justify-center transition-opacity duration-500 ease-out font-['Poppins',sans-serif] overflow-hidden ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <style>{`
        #cc-intro{
          --navy:#0A317B;
          --teal:#1A9C9B;
          --orange:#FA9C16;
        }

        /* ambient floor grid for a subtle sense of 3D space */
        .cci-grid{
          position:absolute; inset:0;
          background-image:
            linear-gradient(rgba(10,49,123,.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(10,49,123,.05) 1px, transparent 1px);
          background-size: 48px 48px;
          -webkit-mask-image: radial-gradient(circle at 50% 45%, black 0%, transparent 70%);
          mask-image: radial-gradient(circle at 50% 45%, black 0%, transparent 70%);
          opacity:0;
          pointer-events:none;
          animation: gridFadeIn 1.4s ease-out .1s forwards;
        }

        .cci-stage{
          position:relative;
          width:100vw; height:100vh;
          display:flex;
          align-items:center;
          justify-content:center;
          perspective: 1400px;
        }

        .cci-camera{
          transform-style: preserve-3d;
          animation: cameraShake .5s ease-out 1.4s 1;
        }

        .cci-scene{
          position:relative;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          transform-style: preserve-3d;
          opacity:0;
          filter: blur(14px);
          transform: scale(1.14);
          padding-bottom: clamp(30px, 6vw, 80px);
          animation: sceneIn .55s cubic-bezier(.2,.7,.3,1) forwards;
        }

        .cci-wordrow{
          position:relative;
          display:flex;
          align-items:baseline;
          line-height:1;
          transform-style: preserve-3d;
        }

        .cci-word{
          font-weight:900;
          font-size:clamp(56px, 11vw, 168px);
          letter-spacing:-0.02em;
          white-space:nowrap;
          will-change: transform, opacity, filter;
          backface-visibility:hidden;
        }

        .cci-career{
          color:var(--navy);
          text-shadow: 0 2px 0 rgba(0,0,0,.08), 0 18px 34px rgba(10,49,123,.22);
          transform: translate3d(-140vw, 0, -700px) rotateY(75deg) rotateX(10deg) rotateZ(-8deg);
          opacity:0;
          animation: flyInLeft 1.05s cubic-bezier(.22,.85,.2,1) .35s forwards,
                     impactShakeL .42s ease-out 1.42s 1,
                     settleGlowL .6s ease-out 1.84s 1;
        }

        .cci-core{
          color:var(--teal);
          text-shadow: 0 2px 0 rgba(0,0,0,.08), 0 18px 34px rgba(26,156,155,.22);
          transform: translate3d(140vw, 0, -700px) rotateY(-75deg) rotateX(10deg) rotateZ(8deg);
          opacity:0;
          position:relative;
          animation: flyInRight 1.05s cubic-bezier(.22,.85,.2,1) .35s forwards,
                     impactShakeR .42s ease-out 1.42s 1,
                     settleGlowR .6s ease-out 1.84s 1;
        }

        /* impact flash at the collision point */
        .cci-impact{
          position:absolute;
          left:50%; top:50%;
          width:10px; height:10px;
          transform: translate(-50%,-50%) scale(0);
          border-radius:50%;
          background: radial-gradient(circle, rgba(250,156,22,.95) 0%, rgba(26,156,155,.55) 40%, rgba(26,156,155,0) 70%);
          opacity:0;
          pointer-events:none;
          animation: impactFlash .6s ease-out 1.4s 1;
        }

        .cci-shockring{
          position:absolute;
          left:50%; top:50%;
          width:20px; height:20px;
          transform: translate(-50%,-50%) scale(0);
          border-radius:50%;
          border:2px solid rgba(10,49,123,.28);
          opacity:0;
          pointer-events:none;
          animation: shockring .8s ease-out 1.42s 1;
        }

        .cci-particles{
          position:absolute;
          left:50%; top:50%;
          width:0; height:0;
          pointer-events:none;
        }
        .cci-particle{
          position:absolute;
          left:0; top:0;
          width:var(--size, 6px); height:var(--size, 6px);
          margin:calc(var(--size, 6px) / -2) 0 0 calc(var(--size, 6px) / -2);
          border-radius:50%;
          background:var(--pcolor, var(--orange));
          opacity:0;
          transform: rotate(var(--angle)) translateX(0) scale(0);
          animation: particleBurst .85s cubic-bezier(.16,.85,.3,1) forwards;
          animation-delay: var(--pdelay, 1.42s);
        }

        .cci-edutech-wrap{
          position:absolute;
          right:0;
          top:100%;
          margin-top:-0.32em;          /* tuck Edutech up close under "Core" */
          text-align:right;
          line-height:1;
          overflow:visible;
        }

        .cci-edutech{
          display:inline-block;
          font-weight:800;
          font-size:clamp(28px, 5.6vw, 80px);
          letter-spacing: 0.01em;
          margin-right:-0.01em;
          color:var(--orange);
        }

        .cci-letter{
          display:inline-block;
          text-shadow: 0 12px 24px rgba(250,156,22,.32);
          transform: translateY(65%) rotateX(35deg);
          opacity:0;
          filter: blur(4px);
          animation: letterUp .55s cubic-bezier(.2,.85,.25,1.15) forwards;
          animation-delay: var(--ldelay, 2.1s);
        }

        .cci-edutech-underline{
          position:absolute;
          left:0; bottom:-10px;
          height:4px;
          width:0;
          border-radius:3px;
          background: linear-gradient(90deg, var(--orange), rgba(250,156,22,.35));
          transform-origin:left center;
          animation: underlineDraw .5s cubic-bezier(.3,.8,.25,1) 2.9s forwards;
        }

        @keyframes gridFadeIn{ to{ opacity:.5; } }

        @keyframes sceneIn{
          to{ opacity:1; filter: blur(0); transform: scale(1); }
        }

        @keyframes cameraShake{
          0%{  transform: translate3d(0,0,0) rotateZ(0); }
          18%{ transform: translate3d(-5px,3px,0) rotateZ(-.4deg); }
          40%{ transform: translate3d(4px,-2px,0) rotateZ(.3deg); }
          65%{ transform: translate3d(-2px,1px,0) rotateZ(-.15deg); }
          100%{transform: translate3d(0,0,0) rotateZ(0); }
        }

        @keyframes flyInLeft{
          0%{   transform: translate3d(-140vw, 10px, -700px) rotateY(75deg) rotateX(10deg) rotateZ(-8deg); opacity:0; filter:blur(7px); }
          28%{  opacity:1; filter:blur(4px); }
          58%{  transform: translate3d(-22vw, -18px, -140px) rotateY(26deg) rotateX(4deg) rotateZ(-3deg); filter:blur(1.5px); }
          82%{  transform: translate3d(2.2vw, 3px, 0) rotateY(-7deg) rotateX(-2deg) rotateZ(1.5deg); opacity:1; filter:blur(0); }
          100%{ transform: translate3d(0, 0, 0) rotateY(0) rotateX(0) rotateZ(0); opacity:1; filter:blur(0); }
        }
        @keyframes flyInRight{
          0%{   transform: translate3d(140vw, 10px, -700px) rotateY(-75deg) rotateX(10deg) rotateZ(8deg); opacity:0; filter:blur(7px); }
          28%{  opacity:1; filter:blur(4px); }
          58%{  transform: translate3d(22vw, -18px, -140px) rotateY(-26deg) rotateX(4deg) rotateZ(3deg); filter:blur(1.5px); }
          82%{  transform: translate3d(-2.2vw, 3px, 0) rotateY(7deg) rotateX(-2deg) rotateZ(-1.5deg); opacity:1; filter:blur(0); }
          100%{ transform: translate3d(0, 0, 0) rotateY(0) rotateX(0) rotateZ(0); opacity:1; filter:blur(0); }
        }

        @keyframes impactShakeL{
          0%{ transform: translate3d(0,0,0) rotateZ(0); }
          20%{ transform: translate3d(-15px,-3px,42px) rotateZ(-2.2deg); }
          45%{ transform: translate3d(9px,2px,-10px) rotateZ(1.1deg); }
          70%{ transform: translate3d(-4px,-1px,4px) rotateZ(-.5deg); }
          100%{ transform: translate3d(0,0,0) rotateZ(0); }
        }
        @keyframes impactShakeR{
          0%{ transform: translate3d(0,0,0) rotateZ(0); }
          20%{ transform: translate3d(15px,-3px,42px) rotateZ(2.2deg); }
          45%{ transform: translate3d(-9px,2px,-10px) rotateZ(-1.1deg); }
          70%{ transform: translate3d(4px,-1px,4px) rotateZ(.5deg); }
          100%{ transform: translate3d(0,0,0) rotateZ(0); }
        }

        @keyframes settleGlowL{
          0%{ filter: drop-shadow(0 0 0 rgba(10,49,123,0)); }
          35%{ filter: drop-shadow(0 0 18px rgba(10,49,123,.45)); }
          100%{ filter: drop-shadow(0 0 0 rgba(10,49,123,0)); }
        }
        @keyframes settleGlowR{
          0%{ filter: drop-shadow(0 0 0 rgba(26,156,155,0)); }
          35%{ filter: drop-shadow(0 0 18px rgba(26,156,155,.45)); }
          100%{ filter: drop-shadow(0 0 0 rgba(26,156,155,0)); }
        }

        @keyframes impactFlash{
          0%{   transform: translate(-50%,-50%) scale(0);   opacity:0; }
          12%{  transform: translate(-50%,-50%) scale(1);    opacity:1; }
          40%{  transform: translate(-50%,-50%) scale(3.6);  opacity:0; }
          100%{ transform: translate(-50%,-50%) scale(3.6);  opacity:0; }
        }
        @keyframes shockring{
          0%{   transform: translate(-50%,-50%) scale(0);   opacity:0; border-width:3px; }
          15%{  opacity:.8; }
          100%{ transform: translate(-50%,-50%) scale(27); opacity:0; border-width:.5px; }
        }

        @keyframes particleBurst{
          0%{   opacity:0; transform: rotate(var(--angle)) translateX(0) scale(0); }
          14%{  opacity:1; transform: rotate(var(--angle)) translateX(6px) scale(1); }
          100%{ opacity:0; transform: rotate(var(--angle)) translateX(var(--dist)) scale(.25); }
        }

        @keyframes letterUp{
          0%{   transform: translateY(65%) rotateX(35deg); opacity:0; filter:blur(4px); }
          60%{  transform: translateY(-6%) rotateX(-4deg); opacity:1; filter:blur(0); }
          100%{ transform: translateY(0) rotateX(0); opacity:1; filter:blur(0); }
        }

        @keyframes underlineDraw{
          to{ width:100%; }
        }

        @media (max-width: 560px){
          .cci-word{ font-size: 15vw; }
          .cci-edutech{ font-size: 7.5vw; }
        }
      `}</style>

      <div className="cci-grid" />

      <div className="cci-stage">
        <div className="cci-camera">
          <div className="cci-scene" id="scene">
            <div className="cci-wordrow" id="wordrow">
              <span className="cci-word cci-career">Career</span>
              <span className="cci-word cci-core" id="core">
                Core
                <div className="cci-edutech-wrap" id="edutechWrap">
                  <span className="cci-edutech" id="edutech" ref={edutechElRef} />
                  <span className="cci-edutech-underline" />
                </div>
              </span>
              <span className="cci-impact" />
              <span className="cci-shockring" />
              <span className="cci-particles" id="particles" ref={particlesElRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
