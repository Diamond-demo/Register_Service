const schema_mongoose = require('mongoose');

const UserSchema = schema_mongoose.Schema(
   {
      userId: {
         type: Number,
         unique: true
      },
      username: { 
         type: String,
         unique: true
      },
      password: { 
         type: String 
      },
      role: { 
         type: String,
         enum: ["admin", "user"], // Limit roles to specific values
         default: "user"
      }
   },

   {
      timestamps: true
   }
);

module.exports = schema_mongoose.model('users', UserSchema);