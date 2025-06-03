import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, HttpRequest, HttpResponse, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable, map, from, mergeMap, concatAll } from 'rxjs';

import { routes } from './app.routes';

function xorCipher(data: Uint8Array, key: Uint8Array): Uint8Array {
  //if (data.length == 0) return new Uint8Array(0);
  const output = new Uint8Array(data.length);

  console.log("what are you", data.length);
  for (let i = 0; i < data.length; i++) {
    output[i] = data[i] ^ key[i % key.length];
  }

  return output;
}

const key = new Uint8Array([1, 2, 3, 4]);

function mainInterceptor(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  console.log("Interception successful.");
  console.log(req);

  const originalContentType = req.headers.get('Content-Type');
  console.log("content type: ", originalContentType);
  let modifiedReq = req;

  console.log("method:",req.method);
  if (req.url.startsWith("http://localhost:8000")) {
    let arr: Uint8Array = xorCipher(new TextEncoder().encode(JSON.stringify(req.body)), key);
    console.assert(originalContentType == null || req.body);
    if (!originalContentType) {
      console.log("arr len: ", arr.length);
    }
    let out: ArrayBuffer = arr.buffer.slice(arr.byteOffset, arr.byteLength + arr.byteOffset);
    console.log("inside method:",req.method);
    let modheaders = req.headers
        .set('Content-Type', 'application/octet-stream')
        .set('Original-Content-Type', originalContentType || 'application/json');
    modifiedReq = req.clone({
      responseType: 'arraybuffer',
      headers: req.body ? modheaders : req.headers,
      body: req.body ? out : null,
    });
    console.log("mod req:", modifiedReq);
  }
  console.log("encry: ", modifiedReq.body);

  return next(modifiedReq).pipe(
    map(event => {
      console.log("eve", event);
      if (event instanceof HttpResponse && event.url?.startsWith("http://localhost:8000")) {
        console.log("eve", event);
        let input_text = new Uint8Array(event.body as ArrayBuffer);
        console.log("win", event.body, typeof event.body);
      	console.log("Before:", new TextDecoder().decode(input_text));
        console.log("After:", new TextDecoder().decode(xorCipher(input_text, key)));
        let modheaders = event.headers;
        if (modheaders.get('Original-Content-Type')) {
          modheaders = modheaders
            .set('Content-Type', modheaders.get('Original-Content-Type') || '')
            .delete('Original-Content-Type');
        }
        let decrypted = event.clone({
          headers: modheaders,
          body: input_text.length ? JSON.parse(new TextDecoder().decode(xorCipher(input_text, key))) : event.body,
        });
        console.log("After: ", decrypted.body);
        return decrypted;
      }
      return event;
    })
  );
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([mainInterceptor])
    ),
  ]
};
