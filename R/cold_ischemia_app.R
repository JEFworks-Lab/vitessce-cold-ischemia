## try to make vitessce app for our data

################### write json files
load('~/OneDrive - Johns Hopkins/2Manuscript_Drafts/2024_spatial_AKI/Manuscript/data/CIS_data.Rdata')

xCIS_0h <- CIS_0h
xCIS_12h <- CIS_12h
xCIS_24h <- CIS_24h
xCIS_48h <- CIS_48h

xCIS_0h$mat <- MERINGUE::normalizeCounts(xCIS_0h$gexp, log=FALSE)
xCIS_12h$mat <- MERINGUE::normalizeCounts(xCIS_12h$gexp, log=FALSE)
xCIS_24h$mat <- MERINGUE::normalizeCounts(xCIS_24h$gexp, log=FALSE)
xCIS_48h$mat <- MERINGUE::normalizeCounts(xCIS_48h$gexp, log=FALSE)

library(limma)

genes.shared <- Reduce(intersect, list(rownames(xCIS_0h$mat), rownames(xCIS_12h$mat), rownames(xCIS_24h$mat), rownames(xCIS_48h$mat)))
CIS_gexp <- data.frame(cbind(
  as.matrix(xCIS_0h$mat[genes.shared,]),
  as.matrix(xCIS_12h$mat[genes.shared,]),
  as.matrix(xCIS_24h$mat[genes.shared,]),
  as.matrix(xCIS_48h$mat[genes.shared,])
))
meta <- data.frame(time = c(
  rep(0, ncol(xCIS_0h$mat)),
  rep(12, ncol(xCIS_12h$mat)), ## unit of days
  rep(24, ncol(xCIS_24h$mat)),
  rep(48, ncol(xCIS_48h$mat))
))  
rownames(meta) <- colnames(CIS_gexp)
table(meta)

annot <- rep('other', nrow(meta))
names(annot) <- rownames(meta)
cortex <- readRDS('~/OneDrive - Johns Hopkins/2Manuscript_Drafts/2024_spatial_AKI/Manuscript/AKI-CIS-irl-ctrl_Cortex_spots.rds')
names(cortex) <- gsub('-', '.',names(cortex))
annot[rownames(meta) %in% names(cortex)] <- 'cortex'
interface <- readRDS('~/OneDrive - Johns Hopkins/2Manuscript_Drafts/2024_spatial_AKI/Manuscript/AKI-CIS-irl-ctrl_Interface_spots.rds')
names(interface) <- gsub('-', '.',names(interface))
annot[rownames(meta) %in% names(interface)] <- 'interface'
medulla <- readRDS('~/OneDrive - Johns Hopkins/2Manuscript_Drafts/2024_spatial_AKI/Manuscript/AKI-CIS-irl-ctrl_Medulla_spots.rds')
names(medulla) <- gsub('-', '.',names(medulla))
annot[rownames(meta) %in% names(medulla)] <- 'medulla'
table(annot)
meta$annot <- annot
head(meta)
colnames(meta) <- c('time', 'compartment')

range(xCIS_0h$pos[,1])
range(xCIS_0h$pos[,2])
t <- 2500

xCIS_12h$pos[,1] <- xCIS_12h$pos[,1] + t
range(xCIS_12h$pos[,1])
range(xCIS_12h$pos[,2])

xCIS_24h$pos[,1] <- xCIS_24h$pos[,1] + 2*t
range(xCIS_24h$pos[,1])
range(xCIS_24h$pos[,2])

xCIS_48h$pos[,1] <- xCIS_48h$pos[,1] + 3*t

## only sig up genes to limit amount of genes written
samiresults <- readxl::read_excel('~/OneDrive - Johns Hopkins/2Manuscript_Drafts/2024_spatial_AKI/Manuscript/Tables/Limma_cpmCIS_DEGs.xlsx')
hist(samiresults$Slope, breaks=1000)
quantile(abs(samiresults$Slope), .90)
table(abs(samiresults$Slope)> 29)
vi <- samiresults$Genes[abs(samiresults$Slope)> 29]
head(vi)

## write all out in json
## genes list
CIS_gexp.sub <- t(CIS_gexp[vi,rownames(meta)])
dim(CIS_gexp.sub)
dim(meta)
## poly list
pos.all <- rbind(xCIS_0h$pos, xCIS_12h$pos, xCIS_24h$pos, xCIS_48h$pos)
rownames(pos.all) <- gsub('-', '.', rownames(pos.all))
head(pos.all)
plot(pos.all)
## factors (time and compartment)
head(meta)

## make polygon hack
generate_circle <- function(pos, radius = 10, n_points = 10) {
  pos <- as.matrix(pos)
  x = pos[1]
  y = pos[2]
  theta <- seq(0, 2 * pi, length.out = n_points + 1)  # Create angles for the circle
  return(data.frame(
    X = x + radius * cos(theta),
    Y = y + radius * sin(theta)
  ))
}
pos.poly <- lapply(rownames(pos.all), function(i) { generate_circle(pos.all[i,]) })
names(pos.poly) <- rownames(pos.all)
plot(pos.poly[[1]])

## make into list for cells.json
cells <- names(pos.poly)
final <- lapply(cells, function(cell) {
  out <- list(
    genes = as.list(CIS_gexp.sub[cell,]),
    poly = as.matrix(pos.poly[[cell]]),
    factors = list(time = as.character(meta[cell,1]), compartment = as.character(meta[cell,2])),
    xy = as.numeric(pos.all[cell,])
  )
  return(out)
})
names(final) <- cells
library(jsonlite)
exportJSON <- toJSON(final, auto_unbox = TRUE)
write(exportJSON, "~/Desktop/vitessce-test/CI_cells.json")

## write clusters.json
cols = rownames(CIS_gexp.sub)
rows = colnames(CIS_gexp.sub)
matrix = lapply(1:ncol(CIS_gexp.sub), function(i) { as.numeric(CIS_gexp.sub[,i]/max(CIS_gexp.sub[,i])) }) ## need to be scaled?
final2 <- list(rows=rows, cols=cols, matrix=matrix)
exportJSON <- toJSON(final2)
write(exportJSON, "~/Desktop/vitessce-test/CI_clusters.json")


########### finally make app
## omg...it can only read from urls...not local 
## need to launch python server
## ~/Desktop/vitessce-test % http-server ./ --cors -p 8000
base_url <- "http://localhost:8000/"

library(vitessceR)
vc <- VitessceConfig$new(schema_version = "1.0.16", name = "Murine Kidney Cold Ischemia")
dataset <- vc$add_dataset("CI")
dataset$add_file(
  url = paste0(base_url, "CI_clusters.json"), 
  file_type = "clusters.json"
)
dataset$add_file(
  url = paste0(base_url, "CI_cells.json"),
  file_type = "cells.json"
)
  

desc <- vc$add_view(dataset, Component$DESCRIPTION)
desc <- desc$set_props(description = "Murine Kidney Cold Ischemia")

spatial <- vc$add_view(dataset, Component$SPATIAL)
spatial_layers <- vc$add_view(dataset, Component$LAYER_CONTROLLER)
gene_list <- vc$add_view(dataset, Component$FEATURE_LIST)

vc$layout(vconcat(
  hconcat(desc, spatial_layers, gene_list),
  hconcat(vconcat(spatial))
))

vc$widget(theme = "dark", width = "100%")

vc$export(with_config = TRUE, out_dir = "~/Desktop/vitessce-test")
