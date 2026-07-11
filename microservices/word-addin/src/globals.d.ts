/*
 * Side-effect imports of stylesheets (import "./x.css") are resolved by
 * webpack's style-loader at build time; this ambient declaration keeps
 * TypeScript from flagging them (TS2882).
 */
declare module "*.css";
