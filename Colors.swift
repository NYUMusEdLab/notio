//
//  Colors.swift
//  saxjaxnotio
//
//  Created by Jakob Skov Søndergård on 14/11/2021.
//

import Foundation
struct ColorPallette:Identifiable{
  let id = UUID()
  let name:String
  let colors :[String]
}

extension ColorPallette{
  static func all()->[ColorPallette]{
    return [
      ColorPallette(name: "colorBlind1", colors:["#882255", "#AA4499", "#CC6677", "#DDCC77", "#88CCEE", "#44AA99", "#117733","#4035FF", "#A8B8EF", "#332288", "#9BB34D", "#D3F3B8"]),
      ColorPallette(name: "colorBlind2", colors:["#920000", "#924900", "#db6d00", "#24ff24", "#ffff6d","#ff6db6", "#ffb6db", "#490092", "#006ddb", "#b66dff","#6db6ff", "#b6dbff"]),//"#009292"
      ColorPallette(name: "pastel", colors:["#F8BBD0", "#E1BEE7", "#D1C4E9", "#C5CAE9", "#BBDEFB", "#B2EBF2", "#B2DFDB", "#C8E6C9", "#DCEDC8", "#FFF9C4", "#FFECB3", "#FFE0B2"]),
      ColorPallette(name: "greenis", colors:  ["#FFAAAA", "#CCFFFF", "#FFFFCC", "#99CCCC", "#66CC99", "#9999CC", "#CC6699", "#FF9900", "#CC99CC", "#FFCC99", "#CCCCFF", "#CCCCCC"]),
      ColorPallette(name: "bright", colors:     ["#ff0000", "#ff8c00", "#ffff00", "#c0c0c0", "#ffffff", "#228b22", "#00ff7f", "#00ffff", "#0000ff", "#87cefa", "#8a2be2", "#ee82ee"]),
      ColorPallette(name: "other", colors: ["#cd0223", "#d45331", "#e39255", "#ecbb10", "#e3d98a", "#47e643", "#28cbb9", "#049496", "#2f7ecc", "#674ed8", "#a059ed", "#ba04ff"])
    ]

  }
}
