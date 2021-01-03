const bcrypt = require('bcryptjs');

const data = {
  users: [
    {
      name: "Ntue",
      email: "user1@example.com",
      password: bcrypt.hashSync("1234", 8),
      isAdmin: false,
      makeups: [
    
      ],
      methods: [
    
      ],
    },
    {
      name: "Dtd",
      email: "user2@example.com",
      password: bcrypt.hashSync("1234", 8),
      isAdmin: false,
      makeups: [
    
      ],
      methods: [
    
      ],
    },
  ],
  makeupsdata: [
    {
      "title":"PONY EFFECT 極水透光氣墊粉餅",
      "img":"./makeup/foundation.png",
      "color_choose":["自然色","明亮白"],
      "color_code_choose":["E2BF9F","EFCDAA"]
    },
    {
        "title":"Za潮色邂逅唇彩 極霧款",
        "img":"./makeup/RD622.png",
        "color_choose":["RD408","PK456"],
        "color_code_choose":["CC5953","FFE8E7"]
    },
    {
        "title":"Za潮色邂逅唇彩 水潤款",
        "img":"./makeup/pRS460.png",
        "color_choose":["RS460","RD666","RD333","RD420","RS352"],
        "color_code_choose":["E84560","D23840","E1464C","E03837","AF4E83"]
    },
    {
        "title":"Za美白聚光粉底精華",
        "img":"./makeup/ZALiquidFoundation.png",
        "color_choose":["OC0W","OC00","OC10","OC20","PO10"],
        "color_code_choose":["EBC29D","E6B993","E0B28A","DFB189","E7BD9A"]
    }
  ]
};
module.exports = data;
