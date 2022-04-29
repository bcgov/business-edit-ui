# LAYOUT

`components/Alteration/` contains components used only by alteration filings
`components/Change/` contains components used only by change filings
`components/common/` contains components used by multiple filing types
`components/Correction/` contains components used only by correction filings

# WARNING

To prevent circular dependencies, do not create or use `index.ts` files for components
in this folder or sub-folders, EXCEPT FOR `@/components/index.ts`, which is used
exclusively by external components.
