const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Task Model
const TaskSchema = new Schema({
  taskName: {
    type: String,
    required: true
  },
  taskDescription: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    default: false,
  },
  creationDate: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  }
});

module.exports = TaskDTO = mongoose.model('task', TaskSchema);