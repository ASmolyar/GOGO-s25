import express from 'express';
import fs from 'fs';
import path from 'path';
import ApiError from '../util/apiError.ts';
import StatusCode from '../util/statusCode.ts';

type HeroCta = {
  label?: string;
  href?: string;
};

type HeroContent = {
  backgroundColor?: string;
  backgroundImage?: string | null;
  title?: string;
  subtitle?: string;
  year?: string;
  tagline?: string;
  bubbles?: string[];
  primaryCta?: HeroCta;
  secondaryCta?: HeroCta;
};

const readJsonFromFile = (relativePath: string): HeroContent => {
  // Attempt to read from absolute path based on current file location
  const candidatePaths = [
    // When compiled to dist, __dirname will be dist/src/controllers
    path.resolve(__dirname, '../../data', relativePath),
    // When running ts-node from src, __dirname will be src/controllers
    path.resolve(__dirname, '../data', relativePath),
    // Fallback to repo root when cwd is project root
    path.resolve(process.cwd(), 'server', 'data', relativePath),
  ];

  for (const candidate of candidatePaths) {
    try {
      if (fs.existsSync(candidate)) {
        const raw = fs.readFileSync(candidate, 'utf-8');
        return JSON.parse(raw) as HeroContent;
      }
    } catch (err) {
      // continue to next candidate
    }
  }
  return {} as HeroContent;
};

export const getHero = async (
  _req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const data = readJsonFromFile(path.join('impact', 'hero.json'));
    return res.status(StatusCode.OK).json({ data });
  } catch (error) {
    return next(ApiError.internal('Failed to load hero content'));
  }
};

export type { HeroContent };




