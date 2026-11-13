import React from 'react';
import {
	AbsoluteFill,
	Audio,
	Easing,
	interpolate,
	OffthreadVideo,
	Sequence,
	staticFile,
	useCurrentFrame,
} from 'remotion';
import timeline from './timeline.json';
import './fonts';
import {FONT_CSS, YELLOW, SAFE} from './theme';
import {HookText, TitleCard, BenefitCard, Outro} from './Overlays';

type Seg = {src: number; from: number; dur: number; tag: string};
const SEGS = timeline.segs as Seg[];
const TOTAL = timeline.total;

// Five benefits of ball mastery (researched), Malay captions.
export const BENEFITS = [
	{
		n: '01',
		title: 'Lebih Banyak Sentuhan',
		sub: 'Satu pemain, satu bola. Ratusan sentuhan setiap sesi.',
	},
	{
		n: '02',
		title: 'Kawalan Rapat',
		sub: 'Bola sentiasa dekat di kaki, senang lepasi lawan.',
	},
	{
		n: '03',
		title: 'Koordinasi & Imbangan',
		sub: 'Latih kaki kiri & kanan, badan lebih stabil.',
	},
	{
		n: '04',
		title: 'Bina Keyakinan',
		sub: 'Selesa dengan bola, berani cuba masa perlawanan.',
	},
	{
		n: '05',
		title: 'Asas Semua Skill',
		sub: 'Dribble, passing & first touch bermula di sini.',
	},
];

const Clip: React.FC<{seg: Seg; index: number}> = ({seg, index}) => {
	const frame = useCurrentFrame();
	// Slow push-in across the clip + punch-in at the cut.
	const drift = interpolate(frame, [0, seg.dur], [1.04, 1.11]);
	const punch = interpolate(frame, [0, 7], [0.09, 0], {
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.cubic),
	});
	// Alternate the drift origin so consecutive shots don't feel identical.
	const origin = index % 2 === 0 ? '50% 55%' : '45% 50%';
	return (
		<AbsoluteFill style={{overflow: 'hidden', backgroundColor: 'black'}}>
			<OffthreadVideo
				src={staticFile('src.mp4')}
				trimBefore={Math.round(seg.src * timeline.fps)}
				muted
				style={{
					width: '100%',
					height: '100%',
					objectFit: 'cover',
					transform: `scale(${drift + punch})`,
					transformOrigin: origin,
					filter: 'contrast(1.08) saturate(1.22) brightness(1.02)',
				}}
			/>
		</AbsoluteFill>
	);
};

// White flash + light streak on every cut.
const CutFlash: React.FC = () => {
	const frame = useCurrentFrame();
	const o = interpolate(frame, [0, 2, 8], [0.55, 0.35, 0], {
		extrapolateRight: 'clamp',
	});
	const x = interpolate(frame, [0, 10], [-400, 1400], {
		extrapolateRight: 'clamp',
	});
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<AbsoluteFill style={{backgroundColor: 'white', opacity: o * 0.6}} />
			<div
				style={{
					position: 'absolute',
					top: -200,
					left: x,
					width: 260,
					height: 2400,
					transform: 'rotate(18deg)',
					background: `linear-gradient(90deg, transparent, rgba(255,214,10,${o}), transparent)`,
					filter: 'blur(20px)',
				}}
			/>
		</AbsoluteFill>
	);
};

// Soft vignette + top gradient so sky captions stay readable.
const Grade: React.FC = () => (
	<AbsoluteFill style={{pointerEvents: 'none'}}>
		<AbsoluteFill
			style={{
				background:
					'radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.45) 100%)',
			}}
		/>
		<AbsoluteFill
			style={{
				background:
					'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 32%)',
			}}
		/>
	</AbsoluteFill>
);

// Thin progress bar placed under the TikTok/IG top UI.
const Progress: React.FC = () => {
	const frame = useCurrentFrame();
	const w = interpolate(frame, [0, TOTAL], [0, 100]);
	return (
		<div
			style={{
				position: 'absolute',
				top: SAFE.top - 30,
				left: SAFE.left,
				width: 1080 - SAFE.left - SAFE.right,
				height: 6,
				borderRadius: 3,
				background: 'rgba(255,255,255,0.25)',
				overflow: 'hidden',
			}}
		>
			<div style={{width: `${w}%`, height: '100%', background: YELLOW}} />
		</div>
	);
};

const SafeZoneGuide: React.FC = () => (
	<AbsoluteFill style={{pointerEvents: 'none'}}>
		<div
			style={{
				position: 'absolute',
				left: SAFE.left,
				top: SAFE.top,
				right: SAFE.right,
				bottom: SAFE.bottom,
				border: '4px dashed rgba(255,0,80,0.9)',
			}}
		/>
	</AbsoluteFill>
);

const sfx = (name: string) => staticFile(`sfx/${name}.mp3`);
const WHOOSHES = ['166', '3115', '1464', '1492'];

const SoundDesign: React.FC = () => {
	const benefitSegs = SEGS.filter((s) => s.tag.startsWith('b'));
	const outro = SEGS.find((s) => s.tag === 'outro')!;
	const title = SEGS.find((s) => s.tag === 'title')!;
	return (
		<>
			{/* Background music, fades in/out. */}
			<Audio
				src={staticFile('music/bgm.mp3')}
				volume={(f) =>
					interpolate(
						f,
						[0, 12, TOTAL - 75, TOTAL - 5],
						[0, 0.8, 0.8, 0],
						{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
					)
				}
			/>
			{/* Hook: coach whistle + impact as the hook text lands. */}
			<Sequence from={0} durationInFrames={40}>
				<Audio src={sfx('615')} volume={0.45} />
			</Sequence>
			<Sequence from={6} durationInFrames={60}>
				<Audio src={sfx('772')} volume={0.7} />
			</Sequence>
			<Sequence from={38} durationInFrames={40}>
				<Audio src={sfx('2364')} volume={0.45} />
			</Sequence>
			{/* Whoosh into each cut (skip first). */}
			{SEGS.slice(1).map((s, i) => (
				<Sequence
					key={`w${i}`}
					from={Math.max(0, s.from - 8)}
					durationInFrames={40}
				>
					<Audio src={sfx(WHOOSHES[i % WHOOSHES.length])} volume={0.35} />
				</Sequence>
			))}
			{/* Title card hit. */}
			<Sequence from={title.from + 4} durationInFrames={140}>
				<Audio src={sfx('2908')} volume={0.55} />
			</Sequence>
			{/* Benefit cards: pop on title, soft click on subtitle. */}
			{benefitSegs.map((s, i) => (
				<React.Fragment key={`b${i}`}>
					<Sequence from={s.from + 8} durationInFrames={36}>
						<Audio src={sfx('2364')} volume={0.5} />
					</Sequence>
					<Sequence from={s.from + 20} durationInFrames={14}>
						<Audio src={sfx('2357')} volume={0.4} />
					</Sequence>
				</React.Fragment>
			))}
			{/* Outro: crowd cheer + sparkle on logo. */}
			<Sequence from={outro.from} durationInFrames={outro.dur}>
				<Audio
					src={sfx('610')}
					volume={(f) =>
						interpolate(f, [0, 15, outro.dur - 40, outro.dur], [0, 0.32, 0.32, 0], {
							extrapolateRight: 'clamp',
						})
					}
				/>
			</Sequence>
			<Sequence from={outro.from + 6} durationInFrames={100}>
				<Audio src={sfx('2350')} volume={0.4} />
			</Sequence>
		</>
	);
};

export const Reel: React.FC<{showSafeZone: boolean}> = ({showSafeZone}) => {
	const benefitSegs = SEGS.filter((s) => s.tag.startsWith('b'));
	const title = SEGS.find((s) => s.tag === 'title')!;
	const outro = SEGS.find((s) => s.tag === 'outro')!;
	return (
		<AbsoluteFill style={{backgroundColor: 'black'}}>
			<style>{FONT_CSS}</style>
			{SEGS.map((s, i) => (
				<Sequence key={i} from={s.from} durationInFrames={s.dur}>
					<Clip seg={s} index={i} />
					{i > 0 ? (
						<Sequence durationInFrames={12}>
							<CutFlash />
						</Sequence>
					) : null}
				</Sequence>
			))}
			<Grade />
			<Progress />

			<Sequence from={0} durationInFrames={SEGS[0].dur + 4}>
				<HookText dur={SEGS[0].dur + 4} />
			</Sequence>
			<Sequence from={title.from} durationInFrames={title.dur}>
				<TitleCard dur={title.dur} />
			</Sequence>
			{benefitSegs.map((s, i) => {
				const dur = Math.min(s.dur + 40, 210);
				return (
					<Sequence key={i} from={s.from + 6} durationInFrames={dur}>
						<BenefitCard {...BENEFITS[i]} dur={dur} />
					</Sequence>
				);
			})}
			<Sequence from={outro.from} durationInFrames={outro.dur}>
				<Outro dur={outro.dur} />
			</Sequence>

			<SoundDesign />
			{showSafeZone ? <SafeZoneGuide /> : null}
		</AbsoluteFill>
	);
};

