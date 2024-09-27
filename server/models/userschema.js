import { type } from "os";
import { DataTypes } from "sequelize";
export const createuser=async(sequelize)=>{
    const User = await sequelize.define('User', {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true, 
          primaryKey: true,
          
        },
        name: {
          type: DataTypes.STRING,
        },
        username: {
          type: DataTypes.STRING,
          unique:true,
        },
        password: {
          type: DataTypes.STRING,
          
        },
        position: {
          type: DataTypes.INTEGER,
        }
      }, {
        tableName: 'users',  
        timestamps: true
      });
      
      return User;
}
export const createblog=async(sequelize)=>{
  const blogDb =await sequelize.define('blogtb',{
    b_id:{
      type:DataTypes.INTEGER,
      autoIncrement: true, 
      primaryKey: true,
    },
    a_id:{
      type:DataTypes.INTEGER,
      
    },
    title:{
      type:DataTypes.STRING,
    },
    desc:{
      type:DataTypes.TEXT,
      
    },
    st:{
      type:DataTypes.BOOLEAN,
      defaultValue: true,
    },
    imagePath: {
      type: DataTypes.STRING,
      
    },
    category:{
      type:DataTypes.STRING,
    },
    rating:{
      type:DataTypes.INTEGER,
    },
  }, {
    tableName: 'blogtb',  
    timestamps: true
  });
  return blogDb;
}
export const createrole=async(sequelize)=>{
  const Role = await sequelize.define('role', {
      r_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true, 
        primaryKey: true,
        
      },
      name: {
        type: DataTypes.STRING,
        unique: true, 
        allowNull:false,
      }
    }, {
      tableName: 'role',  
      timestamps: false,
    });
    
    return Role;
}
export const createHash=async(sequelize)=>{
  const RHashP = await sequelize.define('rhashp', {
      r_id: {
        type:DataTypes.INTEGER,
        allowNull:false
      },
      p_id:{
        type:DataTypes.INTEGER,
        allowNull:false
      }
    }, {
      tableName: 'rhashp',  
      timestamps: false
    });
    
    return RHashP;
}
export const categorytb =async(sequelize)=>{
  const Category =await sequelize.define('Category', {
    category_name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    }
},{
  tableName: 'category',  
  timestamps: false
});
return Category;
}