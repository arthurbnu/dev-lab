---
name : "swift"
title : "Taylor Swift"
description : "Remettez les images de chaque Album au dessus du bon titre de chanson"
nbPics : 7
answerLabel : "trackListLabel"
badges : "musique"
image : "swift.jpg"
icon: "i-lucide-music"
---

```sparql

    #  Albums et titres associés
      SELECT ?albumLabel ?album ?image ?trackListLabel 
      (MD5(CONCAT(str(?trackList),str(RAND()))) as ?random)
      WHERE {
        ?album wdt:P31 wd:Q482994;
              wdt:P1476 ?titre ;
              wdt:P175 ?musicien ;
              wdt:P658 ?trackList.
        
        OPTIONAL{
              ?album wdt:P18 ?albumImage.     
          }
      
          OPTIONAL{
              ?album wdt:P154 ?logoImage.
          }
        
        filter ((?image != '' || ?logoImage != ''))
        filter(?musicien in (wd:Q26876))
        
      #   // sépcifique
            filter (!( ?album in ( wd:Q858750, wd:Q37814092, wd:Q845783))) 
        
        BIND (
        COALESCE(
          ?albumImage,
          ?logoImage
        ) AS ?image
      )
                
        SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
          SERVICE wikibase:label {
          bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en".
          ?trackList rdfs:label ?trackListLabel.
      #       ?album rdfs:label ?albumLabel.
        }
      }
      # GROUP BY  ?albumLabel ?album ?image ?trackListLabel 
      ORDER BY ?random

```