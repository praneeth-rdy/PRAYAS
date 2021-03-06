module.exports = (sequelize, DataTypes) => {
    const Image = sequelize.define('Image', {
        type: {
            type: DataTypes.STRING,
        },
        name: {
            type: DataTypes.STRING,
        },
        data: {
            type: DataTypes.BLOB("long"),
        },
    },
        {
            tableName: 'images'
        });
    Image.prototype.toString = function () {
        return this.name;
    }
    return Image;
};