(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__f2b15f93._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "middleware",
    ()=>middleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$middleware$2f$middleware$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-intl/dist/esm/development/middleware/middleware.js [middleware-edge] (ecmascript)");
;
;
function getCleanPath(pathname) {
    return pathname.replace(/^\/(en|ar|it)(\/|$)/, "/");
}
const PUBLIC_PATHS = [
    "/",
    "/auth/login",
    "/auth/register",
    "/tournaments",
    "/teams",
    "/fields"
];
const ADMIN_PATHS = [
    "/admin"
];
const PROTECTED_PATHS = [
    "/profile"
];
function middleware(request) {
    // ✅ middleware()
    const pathname = request.nextUrl.pathname;
    // i18n first
    const i18nResponse = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$middleware$2f$middleware$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["default"])({
        locales: [
            "en",
            "ar",
            "it"
        ],
        defaultLocale: "en"
    })(request);
    const cleanPath = getCleanPath(pathname);
    // Public
    if (PUBLIC_PATHS.some((p)=>cleanPath === p || cleanPath.startsWith(p + "/"))) {
        return i18nResponse; // ✅ Return i18n response
    }
    // Admin check
    if (ADMIN_PATHS.some((p)=>cleanPath.startsWith(p))) {
        const role = request.cookies.get("user-role")?.value;
        if (role !== "admin") {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/", request.url));
        }
    }
    // Protected check
    if (PROTECTED_PATHS.some((p)=>cleanPath.startsWith(p))) {
        const token = request.cookies.get("auth-token")?.value;
        if (!token) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/auth/login", request.url));
        }
    }
    return i18nResponse; // ✅ Return i18n response
}
const config = {
    matcher: "/((?!api|_next|_vercel|.*\\..*).*)"
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__f2b15f93._.js.map