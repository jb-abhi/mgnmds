// Prerender-only entry (outputMode "static"): no runtime server is deployed.
import { AngularAppEngine } from '@angular/ssr';
export const reqHandler = (req: Request) => new AngularAppEngine().handle(req);
