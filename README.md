# Training UI

Training micro-frontend application for CodeStandoff 2.0.

## Overview

This application provides training functionality including:
- Training courses and tutorials
- Practice problems
- Progress tracking
- Learning paths

## Tech Stack

- Next.js 14 with TypeScript
- Tailwind CSS
- Module Federation (@module-federation/nextjs-mf)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will start on http://localhost:3002

### Building for Production

```bash
npm run build
npm start
```

## Module Federation

This application exposes the `Training` component via Module Federation, which can be consumed by the host application.

## Repository

https://github.com/Abhishek260305/training-ui

