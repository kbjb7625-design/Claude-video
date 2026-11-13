import React from 'react';
import {
	AbsoluteFill,
	Easing,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
	Img,
	staticFile,
} from 'remotion';
import {DARK, SAFE, SAFE_W, YELLOW} from './theme';

const shadow = '0 6px 24px rgba(0,0,0,0.55), 0 2px 4px rgba(0,0,0,0.6)';

const useIn = (delay = 0, damping = 14) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return spring({frame: frame - delay, fps, config: {damping, mass: 0.7}});
};

const useOut = (dur: number, len = 10) => {
	const frame = useCurrentFrame();
	return interpolate(frame, [dur - len, dur], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.in(Easing.cubic),
	});
};

const Ball: React.FC<{size: number; spin: number}> = ({size, spin}) => (
	<svg width={size} height={size} viewBox="0 0 100 100" style={{transform: `rotate(${spin}deg)`}}>
		<circle cx="50" cy="50" r="46" fill="white" stroke="#111" strokeWidth="4" />
		<polygon points="50,30 69,44 62,66 38,66 31,44" fill="#111" />
		<path d="M50 30 L50 6 M69 44 L92 36 M62 66 L76 88 M38 66 L24 88 M31 44 L8 36" stroke="#111" strokeWidth="4" />
	</svg>
);

// Words pop in one by one, staggered.
const StaggerWords: React.FC<{
	text: string;
	start: number;
	step: number;
	style: React.CSSProperties;
	highlight?: string[];
}> = ({text, start, step, style, highlight = []}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return (
		<div style={{display: 'flex', flexWrap: 'wrap', gap: '0 0.25em', ...style}}>
			{text.split(' ').map((w, i) => {
				const s = spring({frame: frame - start - i * step, fps, config: {damping: 12, mass: 0.6}});
				const hl = highlight.includes(w);
				return (
					<span
						key={i}
						style={{
							display: 'inline-block',
							opacity: s,
							transform: `translateY(${(1 - s) * 40}px) scale(${0.7 + s * 0.3})`,
							color: hl ? YELLOW : (style.color as string),
						}}
					>
						{w}
					</span>
				);
			})}
		</div>
	);
};

/* ---------------- HOOK (first ~4s) ---------------- */
export const HookText: React.FC<{dur: number}> = ({dur}) => {
	const frame = useCurrentFrame();
	const out = useOut(dur, 8);
	const shake = frame >= 6 && frame < 14 ? Math.sin(frame * 3) * (14 - frame) * 1.2 : 0;
	const big = useIn(6, 9);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div
				style={{
					position: 'absolute',
					top: SAFE.top + 10,
					left: SAFE.left,
					width: SAFE_W,
					transform: `translateX(${shake}px)`,
				}}
			>
				<StaggerWords
					text="Latihan asas, faedah besar"
					start={0}
					step={3}
					style={{
						fontFamily: 'Montserrat',
						fontWeight: 800,
						fontSize: 54,
						color: 'white',
						textShadow: shadow,
						letterSpacing: 0.5,
					}}
				/>
				<div
					style={{
						fontFamily: 'Anton',
						fontSize: 132,
						lineHeight: 1.0,
						color: YELLOW,
						textShadow: shadow,
						transform: `scale(${0.4 + big * 0.6})`,
						transformOrigin: 'left center',
						opacity: big,
						marginTop: 6,
						textTransform: 'uppercase',
					}}
				>
					5 Faedah
				</div>
				<StaggerWords
					text="Ball Mastery"
					start={30}
					step={4}
					style={{
						fontFamily: 'Anton',
						fontSize: 96,
						lineHeight: 1.05,
						color: 'white',
						textShadow: shadow,
						textTransform: 'uppercase',
					}}
				/>
			</div>
		</AbsoluteFill>
	);
};

/* ---------------- TITLE CARD ---------------- */
export const TitleCard: React.FC<{dur: number}> = ({dur}) => {
	const frame = useCurrentFrame();
	const tag = useIn(0);
	const bar = interpolate(frame, [4, 18], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.cubic),
	});
	const out = useOut(dur, 12);
	const letters = 'LATIHAN KBJB'.split('');
	const {fps} = useVideoConfig();
	const ballX = interpolate(frame, [0, 26], [-160, 0], {
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.back(1.6)),
	});
	return (
		<AbsoluteFill style={{opacity: out}}>
			<div style={{position: 'absolute', top: SAFE.top + 10, left: SAFE.left, width: SAFE_W}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 16}}>
				<Img
					src={staticFile('logo.png')}
					style={{
						width: 84,
						height: 84,
						opacity: tag,
						transform: `scale(${tag}) rotate(${(1 - tag) * -180}deg)`,
						filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))',
					}}
				/>
				<div
					style={{
						display: 'inline-flex',
						alignItems: 'center',
						gap: 14,
						background: YELLOW,
						color: '#111',
						fontFamily: 'Montserrat',
						fontWeight: 900,
						fontSize: 34,
						padding: '10px 22px',
						borderRadius: 10,
						transform: `translateX(${(1 - tag) * -60}px)`,
						opacity: tag,
						letterSpacing: 2,
					}}
				>
					SESI BALL MASTERY
				</div>
				</div>
				<div style={{display: 'flex', alignItems: 'center', marginTop: 12}}>
					<div
						style={{
							fontFamily: 'Anton',
							fontSize: 150,
							lineHeight: 1,
							color: 'white',
							textShadow: shadow,
							display: 'flex',
						}}
					>
						{letters.map((l, i) => {
							const s = spring({frame: frame - 6 - i * 1.5, fps, config: {damping: 11, mass: 0.5}});
							return (
								<span
									key={i}
									style={{
										display: 'inline-block',
										width: l === ' ' ? 34 : undefined,
										opacity: s,
										transform: `translateY(${(1 - s) * 70}px) rotate(${(1 - s) * -12}deg)`,
										color: i >= 8 ? YELLOW : 'white',
									}}
								>
									{l}
								</span>
							);
						})}
					</div>
				</div>
				<div
					style={{
						height: 8,
						width: `${bar * 100}%`,
						background: `linear-gradient(90deg, ${YELLOW}, rgba(255,214,10,0))`,
						borderRadius: 4,
						marginTop: 8,
					}}
				/>
				<div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 16}}>
					<div style={{transform: `translateX(${ballX}px)`}}>
						<Ball size={48} spin={frame * 9} />
					</div>
					<div
						style={{
							fontFamily: 'Montserrat',
							fontWeight: 800,
							fontSize: 38,
							color: 'white',
							textShadow: shadow,
							opacity: interpolate(frame, [14, 24], [0, 1], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'}),
						}}
					>
						8 November 2026
					</div>
				</div>
			</div>
		</AbsoluteFill>
	);
};

/* ---------------- BENEFIT CARD ---------------- */
export const BenefitCard: React.FC<{n: string; title: string; sub: string; dur: number}> = ({
	n,
	title,
	sub,
	dur,
}) => {
	const frame = useCurrentFrame();
	const badge = useIn(0, 10);
	const head = useIn(4, 14);
	const subIn = useIn(14, 16);
	const out = useOut(dur, 10);
	const outY = interpolate(frame, [dur - 10, dur], [0, -40], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const wipe = interpolate(frame, [6, 20], [0, 100], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.cubic),
	});
	return (
		<AbsoluteFill style={{opacity: out, transform: `translateY(${outY}px)`}}>
			<div style={{position: 'absolute', top: SAFE.top + 10, left: SAFE.left, width: SAFE_W}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 18}}>
					<div
						style={{
							width: 92,
							height: 92,
							borderRadius: 46,
							background: YELLOW,
							color: '#111',
							fontFamily: 'Anton',
							fontSize: 50,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							transform: `scale(${badge}) rotate(${(1 - badge) * -120}deg)`,
							boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
							flexShrink: 0,
						}}
					>
						{n}
					</div>
					<div
						style={{
							fontFamily: 'Montserrat',
							fontWeight: 800,
							fontSize: 28,
							letterSpacing: 4,
							color: 'white',
							textShadow: shadow,
							opacity: head,
						}}
					>
						FAEDAH BALL MASTERY
					</div>
				</div>
				<div
					style={{
						position: 'relative',
						marginTop: 14,
						display: 'inline-block',
						clipPath: `inset(0 ${100 - wipe}% 0 0)`,
					}}
				>
					<div
						style={{
							fontFamily: 'Anton',
							fontSize: 100,
							lineHeight: 1.02,
							color: 'white',
							textTransform: 'uppercase',
							textShadow: shadow,
							transform: `translateX(${(1 - head) * -50}px)`,
						}}
					>
						{title}
					</div>
				</div>
				<div
					style={{
						marginTop: 16,
						display: 'inline-block',
						background: DARK,
						borderLeft: `8px solid ${YELLOW}`,
						borderRadius: 12,
						padding: '14px 22px',
						fontFamily: 'Montserrat',
						fontWeight: 600,
						fontSize: 38,
						lineHeight: 1.3,
						color: 'white',
						maxWidth: SAFE_W - 40,
						opacity: subIn,
						transform: `translateY(${(1 - subIn) * 24}px)`,
					}}
				>
					{sub}
				</div>
			</div>
		</AbsoluteFill>
	);
};

/* ---------------- OUTRO ---------------- */
export const Outro: React.FC<{dur: number}> = ({dur}) => {
	const frame = useCurrentFrame();
	const logo = useIn(4, 9);
	const line = useIn(16, 14);
	const cta = useIn(30, 12);
	const pulse = 1 + Math.sin(Math.max(0, frame - 40) / 5) * 0.035;
	const fadeAll = interpolate(frame, [dur - 12, dur], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	return (
		<AbsoluteFill>
			{/* darken sky band for legibility, players below stay clear */}
			<AbsoluteFill
				style={{
					background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 38%, rgba(0,0,0,0) 48%)',
					opacity: logo,
				}}
			/>
			<AbsoluteFill style={{opacity: fadeAll}}>
				<div style={{position: 'absolute', top: SAFE.top + 10, left: SAFE.left, width: SAFE_W}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 22}}>
						<div style={{transform: `scale(${logo}) rotate(${(1 - logo) * -200}deg)`, filter: 'drop-shadow(0 8px 22px rgba(0,0,0,0.5))'}}>
							<Img src={staticFile('logo.png')} style={{width: 190, height: 190, display: 'block'}} />
						</div>
						<div
							style={{
								fontFamily: 'Anton',
								fontSize: 170,
								lineHeight: 0.95,
								color: YELLOW,
								textShadow: shadow,
								transform: `scale(${0.6 + logo * 0.4})`,
								transformOrigin: 'left center',
								opacity: logo,
								letterSpacing: 6,
							}}
						>
							KBJB
						</div>
					</div>
					<div
						style={{
							fontFamily: 'Montserrat',
							fontWeight: 800,
							fontSize: 46,
							color: 'white',
							textShadow: shadow,
							marginTop: 10,
							opacity: line,
							transform: `translateY(${(1 - line) * 20}px)`,
						}}
					>
						Asah skill. Bina keyakinan.
					</div>
					<div
						style={{
							marginTop: 26,
							display: 'inline-flex',
							alignItems: 'center',
							gap: 14,
							background: 'white',
							color: '#111',
							fontFamily: 'Montserrat',
							fontWeight: 900,
							fontSize: 36,
							padding: '16px 30px',
							borderRadius: 60,
							opacity: cta,
							transform: `scale(${cta * pulse})`,
							transformOrigin: 'left center',
							boxShadow: '0 8px 26px rgba(0,0,0,0.4)',
						}}
					>
						<span style={{color: '#E11D48'}}>+</span> FOLLOW untuk sesi seterusnya
					</div>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
