'use strict';

var zlib = window.pako;
var IMG_TYPE = 1;
var IMG_TYPE_MAP = [];
var mColumnCount = 0;
var mRowCount = 0;
var mBaseData = {};
var mSheetID = "mSheetID";
var mSheetName = "IMG WebTool";
var mFileReader = null;
var mFileInput = "";

function AddRow(id,data)
{
    resetSheet(id);
    $$(id).parse(data);
}
function resetSheet(id)
{
    $$(id).config.columnCount = 0;
    $$(id).config.rowCount = 0;
    $$(id).reset();
}

var use_structure = "";
var st_header_list = [];
var TEMP_INFO = `
typedef struct
{
	int mVALUE01;
	int mVALUE02;
	int mVALUE03;
	int mVALUE04;
	int mCENTER[3];
	int mRADIUS;
}
WORLD_REGION_INFO;
//*.WREGION file format structure

typedef struct
{
    int lIndex;
    int lRangeInfo[3];
    int lAttackPower;
    int lDefensePower;
    int lAttackSuccess;
    int lAttackBlock;
    int lElementAttack;
    int lLife;
    int lMana;
}
LEVEL_INFO;
//005_00001.IMG file format structure

typedef struct
{
	int iItemID;
	char iItemName[25];
	char iDescription[3][51];
	char iEmpty[2];
	int iType;
	int iSort;
	int iDataNumber2D;
	int iDataNumber3D;
	int iAddDataNumber3D;
	int iLevel;
	int iGodLevel;
	int iFaction;
	int iEquipInfo;
	int iBuyCost;
	int iSellCost;
	int iLevelLimit;
	int iGodLevelLimit;
	int iCheckMonsterDrop;
	int iCheckNPCSell;
	int iCheckNPCShop;
	int iCheckAvatarDrop;
	int iCheckAvatarTrade;
	int iCheckAvatarShop;
	int iCheckImprove;
	int iCheckHighImprove;
	int iCheckHighItem;
	int iCheckLowItem;
	int iCheckExchange;
	int iStrength;
	int iWisdom;
	int iVitality;
	int iKi;
	int iLuck;
	int iAttackPower;
	int iDefensePower;
	int iAttackSucess;
	int iAttackBlock;
	int iElementAttackPower;
	int iElementDefensePower;
	int iCritical;
	int iPotionType[2];
	int iGainSkillNumber;
	int iLastAttackBonusInfo[2];
	int iCapeInfo[3];
	int iBonusSkillInfo[8][2];
}
ITEM_INFO;
//005_00002.IMG file format structure

typedef struct
{
	int sManaUse;
	int sRecoverInfo[2];
	int sStunAttack;
	int sStunDefense;
	int sFastRunSpeed;
	int sAttackInfo[3];
	int sRunTime;
	int sChargingDamageUp;
	int sAttackPowerUp;
	int sDefensePowerUp;
	int sAttackSuccessUp;
	int sAttackBlockUp;
	int sElementAttackUp;
	int sElementDefenseUp;
	int sAttackSpeedUp;
	int sRunSpeedUp;
	int sShieldLifeUp;
	int sLuckUp;
	int sCriticalUp;
	int sReturnSuccessUp;
	int sStunDefenseUp;
	int sDestroySuccessUp;
}
GRADE_INFO_FOR_SKILL;
//structure for SKILL_INFO

typedef struct
{
	int sIndex;
	char sName[25];
	char sDescription[10][51];
	char sEmpty[1];
	int sType;
	int sAttackType;
	int sDataNumber2D;
	int sTribeInfo[2];
	int sLearnSkillPoint;
	int sMaxUpgradePoint;
	int sTotalHitNumber;
	int sValidRadius;
	GRADE_INFO_FOR_SKILL sGradeInfo[2];
}
SKILL_INFO;
//005_00003.IMG file format structure

typedef struct
{
	int mIndex;
	char mName[25];
	char mChatInfo[2][101];
	char mEmpty[1];
	int mType;
	int mSpecialType;
	int mDamageType;
	int mDataSortNumber3D;
	int mSize[4];
	int mSizeCategory;
	int mCheckCollision;
	int mFrameInfo[6];
	int mTotalHitNum;
	int mHitFrame[3];
	int mTotalSkillHitNum;
	int mSkillHitFrame[3];
	int mBulletInfo[2];
	int mSummonTime[2];
	int mItemLevel;
	int mMartialItemLevel;
	int mRealLevel;
	int mMartialRealLevel;
	int mGeneralExperience;
	int mPatExperience;
	int mLife;
	int mAttackType;
	int mRadiusInfo[2];
	int mWalkSpeed;
	int mRunSpeed;
	int mDeathSpeed;
	int mAttackPower;
	int mDefensePower;
	int mAttackSuccess;
	int mAttackBlock;
	int mElementAttackPower;
	int mElementDefensePower;
	int mCritical;
	int mFollowInfo[2];
	int mDropMoneyInfo[3];
	int mDropPotionInfo[5][2];
	int mDropItemInfo[12];
	int mDropQuestItemInfo[2];
	int mDropExtraItemInfo[50][2];
}
MONSTER_INFO;
//005_00004.IMG file format structure

typedef struct
{
	int nIndex;
	char nName[28];
	int nSpeechNum;
	char nSpeech[5][5][51];
	char nEmpty[1];
	int nTribe;
	int nType;
	int nDataSortNumber2D;
	int nDataSortNumber3D;
	int nSize[3];
	int nMenu[50];
	int nShopInfo[3][28];
	int nSkillInfo1[3][8];
	int nSkillInfo2[3][3][3][8];
	int nGambleCostInfo[145][15];
}
NPC_INFO;
//005_00005.IMG file format structure

typedef struct
{
	int qIndex;
	char qSubject[51];
	char qEmpty[1];
	int qCategory;
	int qStep;
	int qLevel;
	int qType;
	int qSort;
	int qSummonInfo[4];
	int qStartNPCNumber;
	int qKeyNPCNumber[5];
	int qEndNPCNumber;
	int qSolution[4];
	int qReward[3][2];
	int qNextIndex;
	char qStartSpeech[15][51];
	int qStartSpeechColor[15];
	char qHurrySpeech[15][51];
	int qHurrySpeechColor[15];
	char qProcessSpeech1[15][51];
	int qProcessSpeech1Color[15];
	char qProcessSpeech2[15][51];
	int qProcessSpeech2Color[15];
	char qProcessSpeech3[15][51];
	int qProcessSpeech3Color[15];
	char qProcessSpeech4[15][51];
	int qProcessSpeech4Color[15];
	char qProcessSpeech5[15][51];
	int qProcessSpeech5Color[15];
	char qSuccessSpeech[15][51];
	int qSuccessSpeechColor[15];
	char qFailureSpeech[15][51];
	int qFailureSpeechColor[15];
	char qCallSpeech[15][51];
	int qCallSpeechColor[15];
}
QUEST_INFO;
//005_00006.IMG file format structure

typedef struct
{
	int hIndex;
	char hKeyword[5][13];
	int hTribe;
	int hLevel;
	int h2DImage;
}
HELP_INFO;
//005_00007.IMG file format structure

typedef struct
{
int a[10];
}
PET_INFO;
//005_00008.IMG file format structure
`;