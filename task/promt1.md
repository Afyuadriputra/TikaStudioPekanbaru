# TikaStudio Production Performance & Engineering Audit

You are a Staff Frontend Engineer, Performance Engineer, Mobile Web Engineer, Accessibility Engineer, and Software Architect.

Your task is to perform a COMPLETE production engineering audit and implement improvements where appropriate WITHOUT changing the approved UI/UX.

The project already has an approved design system.

DO NOT redesign anything.

DO NOT replace the visual identity.

DO NOT simplify the Apple Liquid Glass aesthetic.

DO NOT change the layout.

DO NOT remove any approved interaction.

Only improve engineering quality.

---

## ARCHITECTURE DECISION (MANDATORY)

These decisions are FINAL and MUST NOT be changed.

KEEP:

✓ Tailwind CSS via CDN
✓ Vanilla JavaScript
✓ HTML Architecture
✓ Apple Liquid Glass Design
✓ Glassmorphism
✓ Mobile First
✓ Existing Folder Structure
✓ Existing Component Layout
✓ Existing Navigation
✓ Existing Animation Style
✓ Existing Skeleton Loader
✓ Existing Quick Look Preview
✓ Existing Bottom Navigation

DO NOT recommend:

✗ Tailwind CLI

✗ Vite

✗ Webpack

✗ React

✗ Vue

✗ Next.js

✗ Build Process Migration

Tailwind CDN is an intentional engineering decision.

Optimize everything around it.

---

## IMAGE STRATEGY

The project now uses WebP.

Keep WebP.

Do NOT recommend replacing WebP.

Keep PNG only as fallback if necessary.

The loading animation MUST remain GIF.

Do NOT recommend Lottie.

Do NOT recommend MP4.

Do NOT recommend WebM.

The loading GIF is part of the branding.

---

## GOAL

Transform the project into a production-ready premium mobile web application while preserving the current architecture.

The application should feel comparable to:

Apple Store

Airbnb

Notion

Linear

Aesop

COS

Glossier

The experience should be smooth, responsive, elegant, stable, and reliable.

---

## LOADING SCREEN

loading.html is NOT a splash screen.

It is the application's Boot Loader.

Its responsibility is:

• Prepare the application safely.

• Initialize required resources.

• Verify essential assets.

• Prepare the homepage.

• Ensure the homepage is ready before entering.

The loading screen should:

✓ Play the branded GIF.

✓ Display elegant loading messages.

✓ Preload only critical resources.

✓ Never preload unnecessary resources.

✓ Avoid blocking the browser.

✓ Use Promise.all where appropriate.

✓ Retry failed requests safely.

✓ Handle offline conditions gracefully.

✓ Show meaningful error UI if initialization fails.

✓ Transition smoothly into index.html.

The homepage should only appear when it is fully ready for interaction.

Avoid layout shifts.

Avoid white flashes.

Avoid broken transitions.

Avoid unfinished rendering.

The boot sequence should follow modern production best practices.

---

## PERFORMANCE AUDIT

Analyze and optimize:

HTML

CSS

JavaScript

Animations

Images

Loading Strategy

Skeleton Loading

Quick Look

Glass Effects

Navigation

Rendering

Memory

CPU

GPU

Touch

Scrolling

Painting

Layout

Network

Caching

Storage

Accessibility

---

## MOBILE PERFORMANCE

Optimize for:

Android Chrome

Samsung Internet

Firefox Android

Edge Android

Safari iPhone

Chrome iPhone

Firefox iPhone

Edge iPhone

iPad Safari

The application must behave consistently across browsers.

---

## IOS COMPATIBILITY

Review:

Safe Area

Dynamic Island

Notch

100vh

100dvh

Toolbar Resize

Address Bar Collapse

Bottom Home Indicator

Viewport Resize

Backdrop Filter

Fixed Header

Fixed Bottom Navigation

Keyboard Resize

Overscroll

Momentum Scrolling

Touch Gestures

Sheet Drag

Quick Look

Prevent Safari rendering bugs.

Provide production-safe fallbacks where necessary.

---

## ANDROID COMPATIBILITY

Review:

Hardware Acceleration

GPU Rendering

Low-end Device Performance

Scroll Performance

Blur Rendering

Image Memory

Touch Latency

Samsung Internet Compatibility

Overscroll

---

## LOADING STRATEGY

Review:

Critical Asset Loading

Preconnect

Preload

Lazy Loading

Decode Async

Priority Images

Network Requests

Duplicate Requests

JSON Cache

Storage Strategy

Loading States

Skeleton States

Error States

Retry States

---

## JAVASCRIPT

Review:

Event Delegation

Memory Leaks

Long Tasks

Debounce

Throttle

AbortController

Promise Handling

Async Flow

Error Handling

Storage Safety

Garbage Collection

DOM Updates

Avoid unnecessary re-rendering.

---

## CSS

Review:

Backdrop Filter Performance

Blur Cost

Shadow Cost

Paint Cost

transition: all

Safe Area

Media Queries

Fallback Styles

Reduce unnecessary repaint.

---

## ACCESSIBILITY

Verify:

Focus Visible

Touch Target

Screen Reader

ARIA

Dialog Focus Trap

Escape

Scroll Lock

Reduced Motion

Keyboard Navigation

Quick Look Accessibility

Search Accessibility

---

## NETWORK

Review:

Caching

Cache Headers

JSON Strategy

Retry Logic

Offline Detection

Graceful Failures

Duplicate Fetch

Request Priority

---

## ANIMATION

Maintain:

Apple Spring

Smooth Scroll

Shared Element Transition

Glass Reflection

Quick Look Motion

Skeleton Fade

Crossfade

Target:

Stable 60 FPS whenever possible.

---

## MEMORY

Prevent:

Memory Leaks

Unnecessary Image Retention

Unused Objects

Duplicate Event Listeners

Excessive DOM Nodes

---

## SECURITY

Review:

Storage Safety

Fetch Safety

Input Safety

Graceful Errors

CSP Recommendations

Cache Recommendations

---

## PRODUCTION QUALITY

Verify:

Core Web Vitals

CLS

LCP

INP

Accessibility

Best Practices

Cross Browser

Mobile Responsiveness

Stability

Production Readiness

---

## OUTPUT

Do NOT redesign.

Do NOT rewrite architecture.

Respect all architectural decisions.

Produce:

1. Engineering Audit Report
2. Prioritized Improvements

🔴 Critical

🟡 Important

🟢 Nice To Have

3. Explain:

Problem

Impact

Why

Solution

Expected Performance Gain

Complexity

Risk

4. If implementation is safe and does not change UI/UX, implement the improvement.

Otherwise only recommend it.

---

## FINAL GOAL

Deliver a premium Apple-quality mobile web application.

Maintain the existing visual design completely.

Keep Tailwind CDN.

Keep GIF loading.

Keep WebP.

Keep Vanilla JavaScript.

Keep the current folder structure.

Focus entirely on engineering quality, performance, accessibility, browser compatibility, loading reliability, and production readiness.

The final experience should feel smooth, stable, elegant, and consistent across Android and iOS browsers.
