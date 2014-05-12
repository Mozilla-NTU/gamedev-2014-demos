var village_data = {};

village_data.GRASS = {
  shortname: '.',
  walkable: true,
  background: {
    x: 0,
    y: 64,
    width: 32,
    height: 32
  }
};

village_data.GRASS_NOWALK = {
  shortname: ',',
  walkable: false,
  background: {
    x: 0,
    y: 64,
    width: 32,
    height: 32
  }
};

village_data.FLOOR = {
  shortname: '-',
  walkable: true,
  background: {
    x: 0,
    y: 0,
    width: 32,
    height: 32
  }
};

village_data.FLOOR_HORIZONTAL = {
  shortname: '_',
  walkable: true,
  background: {
    x: 32,
    y: 0,
    width: 32,
    height: 32
  }
};

village_data.FLOOR_VERTICAL = {
  shortname: '=',
  walkable: true,
  background: {
    x: 64,
    y: 0,
    width: 32,
    height: 32
  }
};

village_data.FLOWER = {
  shortname: 'f',
  walkable: true,
  background: village_data.GRASS.background,
  foreground: {
    x: 96,
    y: 224,
    width: 32,
    height: 32
  }
};

village_data.FLOWER_SMALL = {
  shortname: '*',
  walkable: true,
  background: village_data.GRASS.background,
  foreground: {
    x: 0,
    y: 128,
    width: 32,
    height: 32,
    offsetY: 6
  }
};

village_data.FLOWER_POT = {
  shortname: 'F',
  walkable: false,
  background: village_data.GRASS.background,
  foreground: {
    x: 64,
    y: 224,
    width: 32,
    height: 32
  }
};

village_data.ROCK = {
  shortname: 'r',
  walkable: false,
  background: village_data.GRASS.background,
  foreground: {
    x: 0,
    y: 32,
    width: 32,
    height: 32
  }
};

village_data.ROCK_BIG = {
  shortname: 'R',
  walkable: false,
  background: village_data.GRASS.background,
  foreground: {
    x: 192,
    y: 0,
    width: 32,
    height: 64,
    offsetX: 0,
    offsetY: -32
  }
};

village_data.STICKS = {
  shortname: 's',
  walkable: false,
  background: village_data.GRASS.background,
  foreground: {
    x: 0,
    y: 174,
    width: 32,
    height: 32
  }
};

village_data.BARREL = {
  shortname: 'x',
  walkable: false,
  background: village_data.GRASS.background,
  foreground: {
    x: 0,
    y: 272,
    width: 32,
    height: 32
  }
};

village_data.POT_EMPTY = {
  shortname: 'p',
  walkable: false,
  background: village_data.GRASS.background,
  foreground: {
    x: 126,
    y: 256,
    width: 32,
    height: 32
  }
};

village_data.POT_FULL = {
  shortname: 'P',
  walkable: false,
  background: village_data.GRASS.background,
  foreground: {
    x: 158,
    y: 256,
    width: 32,
    height: 32
  }
};

village_data.FOUNTAIN = {
  shortname: '+',
  walkable: false,
  background: village_data.GRASS.background,
  foreground: {
    x: 228,
    y: 24,
    width: 22,
    height: 40,
    offsetX: 4,
    offsetY: -8
  }
};

village_data.BAMBOO = {
  shortname: '|',
  walkable: true,
  background: village_data.GRASS.background,
  foreground: {
    x: 12,
    y: 330,
    width: 50,
    height: 86,
    offsetX: -10,
    offsetY: -56
  }
};

village_data.BIRDHOUSE = {
  shortname: '!',
  walkable: false,
  background: village_data.GRASS.background,
  foreground: {
    x: 104,
    y: 332,
    width: 20,
    height: 84,
    offsetX: 6,
    offsetY: -56
  }
};

village_data.TREE_SMALL = {
  shortname: '^',
  walkable: true,
  background: village_data.GRASS.background,
  foreground: {
    x: 32,
    y: 258,
    width: 32,
    height: 64,
    offsetY: -32
  }
};

village_data.TREE_SMALL_POT = {
  shortname: 't',
  walkable: false,
  background: village_data.GRASS.background,
  foreground: {
    x: 70,
    y: 256,
    width: 54,
    height: 64,
    offsetX: -10,
    offsetY: -32
  }
};

village_data.TREE_BIG_FULL = {
  shortname: 'T',
  walkable: false,
  background: village_data.GRASS.background,
  foreground: {
    x: 0,
    y: 482,
    width: 116,
    height: 158,
    offsetX: -48,
    offsetY: -126
  }
};

village_data.TREE_BIG_BARE = {
  shortname: '{',
  walkable: false,
  background: village_data.GRASS.background,
  foreground: {
    x: 128,
    y: 484,
    width: 124,
    height: 152,
    offsetX: -48,
    offsetY: -102
  }
};

village_data.TREE_BIG_PINK = {
  shortname: '}',
  walkable: false,
  background: village_data.GRASS.background,
  foreground: {
    x: 128,
    y: 306,
    width: 130,
    height: 110,
    offsetX: -48,
    offsetY: -78
  }
};

village_data.TORII = {
  shortname: '#',
  walkable: false,
  background: village_data.GRASS.background,
  foreground: {
    x: 8,
    y: 1216,
    width: 112,
    height: 96,
    offsetX: -40,
    offsetY: -66
  }
};
