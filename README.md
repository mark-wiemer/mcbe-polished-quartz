# Polished Quartz

Polished Quartz follows my efforts to understand a specific part of Minecraft Bedrock addon development -- creating a new project for version 1.20.30+. This update had some breaking changes that I can't fix in existing projects, so I'm going to try building from scratch and seeing what breaks.

## Installation

1. Install the [prerequisites](https://learn.microsoft.com/en-us/minecraft/creator/documents/scriptinggettingstarted#prerequisites)
1. Copy this folder
1. Open a terminal and navigate to this folder
1. Run `npm i`
1. Follow [chapter 2 of official guide](https://learn.microsoft.com/en-us/minecraft/creator/documents/scriptinggettingstarted#chapter-2-lets-test-the-parts-of-our-project):
   1. Run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` in PowerShell
   1. Run `npm run build`
   1. Add the new "Polished Quartz" behavior pack to a world with the "Beta APIs" flag enabled

When you load the world, you should see a greeting chat message appear every few seconds :)

## Features

Automated tests with [vitest](https://vitest.dev/). Note since we don't have the Minecraft source code, we must be creative with our imports. We're copying the imports that we need for utility functions into a local file and converting them to interfaces. This way, Vitest doesn't worry about missing implementation details.

## References

- [Build a gameplay experience with TypeScript - Microsoft Learn](https://learn.microsoft.com/en-us/minecraft/creator/documents/scriptinggettingstarted)
