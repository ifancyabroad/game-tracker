import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { X, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "./Button";

interface ImageCropperProps {
	imageSrc: string;
	onCropComplete: (croppedBlob: Blob) => void;
	onCancel: () => void;
}

interface CroppedArea {
	x: number;
	y: number;
	width: number;
	height: number;
}

export const ImageCropper: React.FC<ImageCropperProps> = ({ imageSrc, onCropComplete, onCancel }) => {
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedArea | null>(null);

	const onCropChange = (location: { x: number; y: number }) => {
		setCrop(location);
	};

	const onCropAreaChange = useCallback((_croppedArea: unknown, croppedAreaPx: CroppedArea) => {
		setCroppedAreaPixels(croppedAreaPx);
	}, []);

	const createCroppedImage = async () => {
		if (!croppedAreaPixels) return;

		const image = new Image();
		image.src = imageSrc;
		await new Promise((resolve) => {
			image.onload = resolve;
		});

		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const targetSize = 400; // Output size in pixels
		canvas.width = targetSize;
		canvas.height = targetSize;

		ctx.drawImage(
			image,
			croppedAreaPixels.x,
			croppedAreaPixels.y,
			croppedAreaPixels.width,
			croppedAreaPixels.height,
			0,
			0,
			targetSize,
			targetSize,
		);

		canvas.toBlob(
			(blob) => {
				if (blob) {
					onCropComplete(blob);
				}
			},
			"image/jpeg",
			0.9,
		);
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
			<div className="relative flex h-full w-full max-w-2xl flex-col">
				<div className="mb-3 flex items-center justify-between sm:mb-4">
					<h2 className="text-lg font-semibold text-white sm:text-xl">Crop Image</h2>
					<button
						onClick={onCancel}
						className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white"
					>
						<X className="h-5 w-5" />
					</button>
				</div>

				<div className="relative min-h-0 flex-1 rounded-lg bg-black">
					<Cropper
						image={imageSrc}
						crop={crop}
						zoom={zoom}
						aspect={1}
						cropShape="round"
						showGrid={false}
						onCropChange={onCropChange}
						onCropComplete={onCropAreaChange}
						onZoomChange={setZoom}
					/>
				</div>

				<div className="mt-3 flex flex-col gap-3 sm:mt-4 sm:flex-row sm:items-center sm:gap-4">
					<div className="flex flex-1 items-center gap-2">
						<ZoomOut className="h-4 w-4 shrink-0 text-white/70" />
						<input
							type="range"
							min={1}
							max={3}
							step={0.1}
							value={zoom}
							onChange={(e) => setZoom(parseFloat(e.target.value))}
							className="flex-1"
						/>
						<ZoomIn className="h-4 w-4 shrink-0 text-white/70" />
					</div>
					<div className="flex gap-2">
						<Button
							type="button"
							onClick={onCancel}
							className="flex-1 bg-white/90 text-black hover:bg-white sm:flex-none"
						>
							Cancel
						</Button>
						<Button type="button" onClick={createCroppedImage} className="flex-1 sm:flex-none">
							Crop & Upload
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};
