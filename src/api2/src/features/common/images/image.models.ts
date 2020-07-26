import { Entity } from "../kernel";
import { prop } from "@typegoose/typegoose";

export class Image extends Entity {
	@prop({ required: true })
	public data!: string;

	constructor(init?: Image) {
		super();
		Object.assign(this, init);
	}
}

// export class ImageBase extends Entity {
// 	@prop({ type: String })
// 	public storageType?: 'Base64' | 'Blob';
// }

// export class ImageBlob extends ImageBase {
// 	@prop({ required: true })
// 	public data!: Buffer;

// 	@prop({ required: true })
// 	public contentType!: string;

// 	constructor(init?: ImageBlob) {
// 		super();
// 		Object.assign(this, init);
// 		this.storageType = 'Blob';
// 	}
// }

// export class ImageBase64 extends ImageBase {
// 	@prop({ required: true })
// 	public data!: string;

// 	constructor(init?: ImageBase64) {
// 		super();
// 		Object.assign(this, init);
// 		this.storageType = 'Base64';
// 	}
// }