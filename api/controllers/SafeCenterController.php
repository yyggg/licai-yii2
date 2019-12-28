<?php
/**
 * Created by 老杨.
 * User: 260101081@qq.com
 * Date: 2018/10/10 15:19
 */

namespace api\controllers;
use api\models\RollInLogs;
use api\models\RollOutLogs;
use api\models\User;
use Yii;

class SafeCenterController extends BaseCotroller
{
    /**
     * 个人信息
     * @return mixed
     */
    public function actionUserInfo()
    {
        $user['username'] = substr_replace(Yii::$app->user->identity->username, '****', 3, 4);
        $user['real_name'] = Yii::$app->user->identity->real_name;
        $user['id_card'] = substr_replace(Yii::$app->user->identity->id_card, '****', 9, 4);
        $user['trans_password'] = Yii::$app->user->identity->trans_password ? '●●●●●●' : '';
        $user['bank_number'] = Yii::$app->user->identity->bank_number ? substr(Yii::$app->user->identity->bank_number, 0, 15).'**** ' : '';
        $user['alipay'] = Yii::$app->user->identity->alipay ? substr_replace(Yii::$app->user->identity->alipay, '****', 0, 4) : '';
        $user['tenpay'] = Yii::$app->user->identity->tenpay ? substr_replace(Yii::$app->user->identity->tenpay, '****', 3, 3) : '';
        $this->_errMsg['0']['data'] = $user;
        return $this->_errMsg['0'];
    }

    /**
     * 修改登录或交易密码
     * @return mixed
     * @throws \yii\base\Exception
     */
    public function actionUpdatePassword()
    {
        $postData = Yii::$app->request->post();
        $model = User::findIdentity(Yii::$app->user->identity->getId());
        if($postData['type'] == '1') //修改登录密码
        {
            if(!$model->validatePassword($postData['oldpwd'])){
                return $this->_errMsg['1007'];
            }
            $model->setPassword($postData['newpwd']);
        }
        else //修改交易密码
        {
            if($model->trans_password && !$postData['oldpwd'])
            {
                return $this->_errMsg['1009'];
            }
            if($model->trans_password)
            {
                if(!Yii::$app->security->validatePassword($postData['oldpwd'], $model->trans_password)){
                    return $this->_errMsg['1007'];
                }
            }

            $model->trans_password = Yii::$app->security->generatePasswordHash($postData['newpwd']);
        }

        if(!$model->save()) {
            return $this->_errMsg['1008'];
        }
        return $this->_errMsg['0'];
    }

    /**
     * 修改用户某个字段信息
     * @return mixed
     */
    public function actionUpdateField()
    {
        $postData = Yii::$app->request->post();
        $model = User::findOne(['id' => Yii::$app->user->identity->getId()]);

        $model->setAttribute($postData['fieldname'], $postData['fieldval']);

        if($model->save()){
            return $this->_errMsg['0'];
        }
        return $this->_errMsg['1008'];
    }

    /**
     * 绑定银行信息
     * @return mixed
     */
    public function actionUpdateBank()
    {
        $postData = Yii::$app->request->post();
        $model = User::find()->where(['id' => Yii::$app->user->identity->getId()])->one();
        $model->setAttributes($postData);
        if($model->save()){
            return $this->_errMsg['0'];
        }
        return $this->_errMsg['1008'];
    }

    /**
     * 转入
     * @return mixed
     */
    public function actionRollIn()
    {
        $postData = Yii::$app->request->post();
        $rollInModel = new RollInLogs();

        if(!is_numeric($postData['roll_in']))
        {
            return $this->_errMsg['1050'];
        }
        if($this->getFloatLength($postData['roll_in']) > 2){
            return $this->_errMsg['1051'];
        }

        $rollInModel->point = $postData['roll_in'] * 100;
        $rollInModel->user_id = Yii::$app->user->identity->getId();
        if(!$rollInModel->save()){
            return $this->_errMsg['1052'];
        }
        return $this->_errMsg['0'];

        /*$trans = Yii::$app->db->beginTransaction();
        try{
            $rollInModel->point = $postData['roll_in'] * 100;
            $rollInModel->user_id = Yii::$app->user->identity->getId();
            if(!$rollInModel->save()){
                return $this->_errMsg['1052'];
            }
            $user = User::findOne(['id' => Yii::$app->user->identity->getId()]);
            $user->amount =
            $trans->commit();
        }catch (\Exception $e){
            $trans->rollBack();

        }*/
    }

    /**
     * 转出
     * @return mixed
     */
    public function actionRollOut()
    {
        $postData = Yii::$app->request->post();
        $rollOutModel = new RollOutLogs();
        $user = User::findOne(['id' => Yii::$app->user->identity->getId()]);
        if(!is_numeric($postData['roll_out']))
        {
            return $this->_errMsg['1053'];
        }
        if($this->getFloatLength($postData['roll_out']) > 2){
            return $this->_errMsg['1054'];
        }

        if(($postData['roll_out']*100) > $user->amount){
            return $this->_errMsg['1056'];
        }

        $rollOutModel->point = $postData['roll_out'] * 100;
        $rollOutModel->pay_type = $postData['pay_type'];
        $rollOutModel->user_id = Yii::$app->user->identity->getId();
        if(!$rollOutModel->save()){
            return $this->_errMsg['1055'];
        }
        return $this->_errMsg['0'];

    }
}