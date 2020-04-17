import { Router } from 'express';

export type MiddlewareFn = ((router: Router) => void);
