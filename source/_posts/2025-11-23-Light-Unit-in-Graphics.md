---
title: Light Unit in Graphics
date: 2025-11-23 14:19:27
categories:
- Computer Graphics
- BRDF
tags: 
- Computer Graphics
- BRDF
---


# 单位
| QUANTITY | RADIOMETRIC | PHOTOMETRIC |
|----------|-------------|-------------|
| Power | W | Lumen (lm) = cd·sr |
| Power Per Unit Area | W/m² | Lux (lx) = cd·sr/m² = lm/m² |
| Power Per Unit Solid Angle | W/sr | Candela (cd) |
| Power Per Unit Area Per Unit Solid Angle | W/m²·sr | cd/m² = lm/m²·sr = nit |
> 来源：[Radiometric vs. Photometric Units](https://www.thorlabs.de/catalogPages/506.pdf)

> I don’t know of any game engines where they attribute real-world units to lighting and material values, since those kinds of things tend to be driven more by the appearance than the physical correctness. The relative intensities of, say, a candle and a 100W light bulb are probably more important than the absolute values.[<sup>Lighting: The Rendering Equation</sup>]()

- [Radiometry, part 1: I got it backwards](https://momentsingraphics.de/Radiometry1Backwards.html)
- [What units should I use for lighting in a 3D rendering engine?](https://stackoverflow.com/questions/34563197/what-units-should-i-use-for-lighting-in-a-3d-rendering-engine)
- [Moving Frostbite to Physically Based Rendering 2.0](https://media.contentapi.ea.com/content/dam/eacom/frostbite/files/course-notes-moving-frostbite-to-pbr-v2.pdf)
- [Physical Units for Lights](https://www.realtimerendering.com/blog/physical-units-for-lights/)
- [Physical Lighting Units](https://dev.epicgames.com/documentation/en-us/unreal-engine/physical-lighting-units?application_version=4.27)
- [Filament lighting/units](https://google.github.io/filament/Filament.md.html#lighting/units)
- [Understand physical light units](https://docs.unity3d.com/Packages/com.unity.render-pipelines.high-definition@17.2/manual/Physical-Light-Units.html)
- [Lighting: The Rendering Equation](https://www.rorydriscoll.com/2008/08/24/lighting-the-rendering-equation/)
- [Using Physically Correct Brightness in Cycles](https://blendergrid.com/learn/articles/cycles-physically-correct-brightness), [emission](https://docs.blender.org/manual/en/4.5/render/shader_nodes/shader/emission.html)