module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    nips: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "users_email_unique"
    },
    phone: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    level: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    fakultas_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "0"
    },
    prodi_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "0"
    },
    status: {
      type: DataTypes.ENUM('no','yes'),
      allowNull: false,
      defaultValue: "no"
    },
    email_verified_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    remember_token: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
      created_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'users',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "users_email_unique",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "email" },
        ]
      },
    ]
  });
};
