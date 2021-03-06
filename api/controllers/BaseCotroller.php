<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/10/8
 * Time: 2:20
 */

namespace api\controllers;

use api\models\LowerRelation;
use api\models\User;
use yii\rest\ActiveController;
use \yii\filters\auth\HttpBearerAuth;

class BaseCotroller extends ActiveController
{
    public $modelClass = 'api\models\User';

    public $_user;
    public $_userId;

    /**
     * 错误码
     * @var array
     */
    public $_errMsg = [
        '0' => ['code' => 0, 'msg' => 'OK'],

        '1000' => ['code' => 1000, 'msg' => '登录成功'],
        '1001' => ['code' => 1001, 'msg' => '未登录'],
        '1002' => ['code' => 1002, 'msg' => '登录失败，请检察输入的账号密码是否正确'],

        '1003' => ['code' => 1003, 'msg' => '注册成功'],
        '1004' => ['code' => 1004, 'msg' => '注册信息验证失败'],
        '1005' => ['code' => 1005, 'msg' => '注册失败'],

        '1006' => ['code' => 1006, 'msg' => 'access_token 无效'],
        '1007' => ['code' => 1007, 'msg' => '修改失败，旧密码不正确'],
        '1008' => ['code' => 1008, 'msg' => '修改失败'],
        '1009' => ['code' => 1009, 'msg' => '请输入原交易密码'],

        '1050' => ['code' => 1050, 'msg' => '转入失败，金额不是一个数字'],
        '1051' => ['code' => 1051, 'msg' => '转入失败，金额只支持2位小数'],
        '1052' => ['code' => 1052, 'msg' => '转入失败'],
        '1053' => ['code' => 1053, 'msg' => '转出失败，金额不是一个数字'],
        '1054' => ['code' => 1054, 'msg' => '转出失败，金额只支持2位小数'],
        '1055' => ['code' => 1055, 'msg' => '转出失败'],
        '1056' => ['code' => 1056, 'msg' => '转出失败，转出金额超出'],

    ];

    /**
     * 登录授权
     * @return array
     */
    public function behaviors()
    {
        $behaviors = parent::behaviors(); // TODO: Change the autogenerated stub

        $behaviors['authenticator'] = [
            'class' => HttpBearerAuth::className(),
            'optional' => ['login','logout','signup'], //不用授权方法
        ];

        return $behaviors;
    }

    /**
     * 金额格式化
     * @param $amount
     * @return string
     */
    public function moneyFormat($amount){
        return number_format($amount/100,2);
    }

    /**
     * 获取小数点位数
     * @param $num
     * @return int
     */
    public function getFloatLength($num) {
        $count = 0;

        $temp = explode ( '.', $num );

        if (sizeof ( $temp ) > 1) {
            $decimal = end ( $temp );
            $count = strlen ( $decimal );
        }
        return $count;
    }

    /**
     * 生成层级关系
     * @param $user_id
     * @param int $reg_user_id
     */
    public function createLevelRelation($user_id, $reg_user_id)
    {
        $lowerRelationModel = new LowerRelation();
        $allUser = LowerRelation::find()->where(['lower_user_id' => $user_id])->limit(4);

        $lowerRelationModel->user_id = $user_id;
        $lowerRelationModel->lower_user_id = $reg_user_id;
        $lowerRelationModel->level = 1;
        $lowerRelationModel->save(false);

        if($allUser){
            foreach ($allUser as $v)
            {
                $lowerRelationModel->user_id = $v['user'];
                $lowerRelationModel->level += 1;
                $lowerRelationModel->lower_user_id = $reg_user_id;
                $lowerRelationModel->save(false);
            }
        }
    }

}