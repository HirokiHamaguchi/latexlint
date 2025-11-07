import { beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';

// kuromoji.jsをグローバル変数としてロード
import * as kuromojiModule from '../src/kuromoji/kuromoji.js';
// @ts-expect-error - グローバル変数として設定
global.kuromoji = kuromojiModule as unknown;

// テスト環境でXMLHttpRequestをモックして、ローカルファイルシステムから辞書を読み込む
beforeAll(() => {
    const OriginalXMLHttpRequest = global.XMLHttpRequest;

    class MockXMLHttpRequest extends OriginalXMLHttpRequest {
        private _url: string = '';
        private _method: string = '';
        public responseType: XMLHttpRequestResponseType = '';
        public onload: ((this: XMLHttpRequest, ev: ProgressEvent) => unknown) | null = null;
        public onerror: ((this: XMLHttpRequest, ev: ProgressEvent) => unknown) | null = null;
        private _response: unknown = null;
        private _status: number = 0;
        private _readyState: number = 0;

        open(method: string, url: string): void {
            this._method = method;
            this._url = url;
            this._readyState = 1;
        }

        send(): void {
            // /latexlint/dict/ または /dict/ で始まるURLをローカルファイルに変換
            let fileName = '';
            if (this._url.startsWith('/latexlint/dict/')) {
                fileName = this._url.replace('/latexlint/dict/', '');
            }

            if (fileName) {
                const dictPath = path.resolve(__dirname, '../public/dict', fileName);

                try {
                    const data = fs.readFileSync(dictPath);

                    if (this.responseType === 'arraybuffer') {
                        this._response = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
                    } else {
                        this._response = data;
                    }
                    this._status = 200;
                    this._readyState = 4;

                    // onloadイベントを非同期で発火
                    setTimeout(() => {
                        if (this.onload) {
                            const event = new ProgressEvent('load', {
                                lengthComputable: true,
                                loaded: data.length,
                                total: data.length
                            });
                            this.onload.call(this as unknown as XMLHttpRequest, event);
                        }
                    }, 0);
                } catch {
                    this._status = 404;
                    this._readyState = 4;

                    setTimeout(() => {
                        if (this.onerror) {
                            const event = new ProgressEvent('error');
                            this.onerror.call(this as unknown as XMLHttpRequest, event);
                        }
                    }, 0);
                }
            } else {
                // 通常のXMLHttpRequestの動作
                super.send();
            }
        }

        get response(): unknown { return this._response; }
        get status(): number { return this._status; }
        get readyState(): number { return this._readyState; }
    }

    // グローバルなXMLHttpRequestを置き換え
    global.XMLHttpRequest = MockXMLHttpRequest as unknown as typeof XMLHttpRequest;
});
