'use strict';
const IN_COME = 1;
const OUT_COME = -1;
const ZERO_STATE = 0;

module.exports = function(sequelize, DataTypes) {
    var logs = sequelize.define('logs', {
        text: DataTypes.TEXT,
        user_name: DataTypes.TEXT('tiny'),
        user_id: DataTypes.TEXT('tiny'),
        state: {
            type: DataTypes.BOOLEAN,
            get(){
                var state = this.getDataValue('state');
                if(state == IN_COME){
                    return 'in';
                }
                if(state == OUT_COME){
                    return 'out';
                }
                return 'unknown';
            },
            set(val){
                switch (val){
                    case 'in':
                        this.setDataValue('state', IN_COME);
                        break;
                    case 'out':
                        this.setDataValue('state', OUT_COME);
                        break;
                    default:
                        this.setDataValue('state', ZERO_STATE);
                }
            }
        },
        valid: {
            type: DataTypes.INTEGER(1),
            defaultValue: 1
        },
        timestamp_msg: DataTypes.DATE,
        timestamp_usr: DataTypes.DATE,
    }, {
        classMethods: {
            associate: function(models) {
            }
        },
    });
    return logs;
};