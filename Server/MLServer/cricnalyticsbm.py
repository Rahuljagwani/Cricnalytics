# -*- coding: utf-8 -*-
"""CricnalyticsBM.ipynb

Automatically generated by Colaboratory.

Original file is located at
    https://colab.research.google.com/drive/1XnU6_mUM49HZSS_LfzzXTDlcWNH7zUnc
"""

from sklearn.datasets import fetch_california_housing as f_c_h 
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import pickle
from scipy.stats import loguniform
from scipy.stats import uniform
from sklearn.dummy import DummyRegressor as dr
from sklearn.linear_model import LinearRegression as lr
from sklearn.linear_model import LassoCV as lcv
from sklearn.linear_model import Lasso as lso
from sklearn.linear_model import RidgeCV as rcv
from sklearn.linear_model import Ridge as rdg
from sklearn.linear_model import SGDRegressor as sgdr
from sklearn.metrics import mean_squared_error as mse
from sklearn.metrics import mean_absolute_percentage_error as mape
from sklearn.model_selection import cross_validate as c_v
from sklearn.model_selection import cross_val_score as cvs
from sklearn.model_selection import train_test_split as tts
from sklearn.model_selection import ShuffleSplit as sss
from sklearn.model_selection import validation_curve as vc
from sklearn.model_selection import GridSearchCV as gscv
from sklearn.model_selection import RandomizedSearchCV as rscv
from sklearn.preprocessing import PolynomialFeatures as pf
from sklearn.preprocessing import StandardScaler as ss
from sklearn.pipeline import Pipeline as p
 
 
ipl = pd.read_csv (r'F:\CRICNALYTCS\Server\MLServer\IPL_Data_BM.csv')
#print(ipl)

features=ipl.loc[:,ipl.columns!='ValueinCR'].values
labels=ipl.loc[:,'ValueinCR'].values

np.random.seed(306)

cv = sss(n_splits=10,test_size=0.2,random_state=42)

f, l = (features,labels)
c_train_f, test_f, c_train_l, test_l = tts(f,l,random_state=42)
train_f, dev_f, train_l, dev_l = tts(c_train_f,c_train_l,random_state=42)

lso_reg_pipeline2 = p([("poly",pf(degree=1)),
                      ("feature_scaling",ss()),
                      ("lasso",lso(alpha=0.615848211066026,
                                   max_iter=100000))])
lso_reg_cv_results = c_v(lso_reg_pipeline2,
                         c_train_f,
                         c_train_l,
                         cv=cv,
                         scoring="neg_mean_absolute_error",
                         return_train_score=True,
                         return_estimator=True,
                         )
'''lso_reg_train_error = -1*lso_reg_cv_results['train_score']
lso_reg_test_error = -1*lso_reg_cv_results['test_score']
print(lso_reg_train_error.mean(),"  ",lso_reg_train_error.std())
print(lso_reg_test_error.mean(),"  ",lso_reg_test_error.std())'''

bm=lso_reg_pipeline2.fit(c_train_f,c_train_l)
#bm.predict(test_f)
pickle.dump(bm, open('cricnalyticsbm.pkl','wb'))

# Loading model to compare the results
bm1= pickle.load(open('cricnalyticsbm.pkl','rb'))
print(bm1.predict(test_f))

print(bm.predict([[35,1,0,0,1,10,250,85,25,150.00]]))