<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/10/8
 * Time: 13:07
 */
namespace api\controllers;

use api\models\ProfitLogs;
use api\models\RollInLogs;
use api\models\RollOutLogs;
use api\models\User;
use Yii;
use api\models\LoginForm;
use api\models\SignupForm;

class UserController extends BaseCotroller
{
    public $modelClass = 'api\models\User';

    /**
     * 登录
     * @return mixed
     */
    public function actionLogin()
    {
        $model = new LoginForm();
        $model->setAttributes(\Yii::$app->request->post());

        if($model->login())
        {
            $this->_errMsg['0']['data']['access_token'] = $model->_user->access_token;
            return $this->_errMsg['0'];
        }
        return $this->_errMsg['1002'];
    }

    /**
     * 判断ACCESS_TOKEN有效性
     * @return mixed
     */
    public function actionLoginStatus(){
        $token = Yii::$app->request->headers->get('Authorization');
        if(User::validateAccessToken($token)){
           return $this->_errMsg['0'];
        }
        return $this->_errMsg['1006'];
    }

    /**
     * 注册
     * @param int $user_id
     * @return User|null
     */
    public function actionSignup($user_id = 0)
    {
        $model = new SignupForm();
        $postData = ['SignupForm' => Yii::$app->request->post()];

        if ($model->load($postData)) {
            $errMsg = $model->signup();
            if ($errMsg['code']) {
                return $errMsg;
            }
            $this->_errMsg['0']['data']['access_token'] = $errMsg['access_token'];
            $this->createLevelRelation($user_id, $model->id); //生成层级关系
            return $this->_errMsg['0'];
        }
        return $this->_errMsg['1004'];
    }

    /**
     * 用户首页
     * @return mixed
     */
    public function actionInfo()
    {
        $data = [];
        $user = Yii::$app->user->identity;

        $data['username'] = $user->real_name ? $user->real_name : $user->username;
        $data['id'] = $user->id;
        $data['amount']   = $this->moneyFormat($user['amount']);
        $data['amount_total'] = $this->moneyFormat( ProfitLogs::getProfitTotal($user->id) );

        $this->_errMsg['0']['data'] = $data;
        return $this->_errMsg['0'];
    }

    /**
     * 转出明细列表
     * @return mixed
     */
    public function actionRollOutList()
    {
        $getData = Yii::$app->request->get();
        $status = ['转出中','转出失败','转出成功'];
        $data = [];
        $model = RollOutLogs::getPage(Yii::$app->user->identity->getId(), $getData['page']);

        foreach ($model as $k => $v)
        {
            $data[$k]['point'] = $this->moneyFormat($v['point']);
            $data[$k]['status'] = $status[$v['status']];
            $data[$k]['create_time'] = $v['create_time'];
            $data[$k]['pay_type'] = $v['pay_type'];
        }
        $this->_errMsg['0']['data']['lists'] = $data;
        return $this->_errMsg['0'];
    }

    /**
     * 转入明细列表
     * @return mixed
     */
    public function actionRollInList()
    {
        $getData = Yii::$app->request->get();
        $status = ['转入中','转入失败','转入成功'];
        $data = [];
        $model = RollInLogs::getPage(Yii::$app->user->identity->getId(), $getData['page']);

        foreach ($model as $k => $v)
        {
            $data[$k]['point'] = $this->moneyFormat($v['point']);
            $data[$k]['status'] = $status[$v['status']];
            $data[$k]['create_time'] = $v['create_time'];
            $data[$k]['pay_type'] = $v['pay_type'];
        }
        $this->_errMsg['0']['data']['lists'] = $data;
        return $this->_errMsg['0'];
    }
}