## Load library
library(tidyverse)
library(magrittr)
library(zoo)
library(ggplot2)
library(scales)
library(maps)
library(mapdata)
library(grid)

## Get working directory
curr_wd <- strsplit(getwd(), "/")[[1]]
if ("chunheisiu" %in% curr_wd) {
  ##setwd("/Users/chunheisiu/Dropbox/Documents/USF/2018_Spring/BSDS_100/USF-BSDS100-CaseStudy")
} else if ("jacquessham" %in% curr_wd){
  setwd("/Users/jacquessham/Documents/GitHub/USF-CS360-FinalProject")
} else {
  wd <- readline(prompt = "You're not Jacques or Charles! Enter the path to the data: ")
  setwd(wd)
}

## Read the data
data <- read.csv("whisky.csv")

## Rename columns
names(data) <- c("whisky","score","sd","reviews","cost","class","super_cluster","cluster","country","type")


## Explore data
data %>% group_by(country) %>% summarise(meanScore = mean(score,na.rm=T))
data %>% count(country)
