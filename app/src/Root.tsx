import React from 'react';
import {Composition} from 'remotion';
import {Reel} from './Reel';
import timeline from './timeline.json';

export const RemotionRoot: React.FC = () => {
	return (
		<Composition
			id="Reel"
			component={Reel}
			durationInFrames={timeline.total}
			fps={timeline.fps}
			width={1080}
			height={1920}
			defaultProps={{showSafeZone: false}}
		/>
	);
};
