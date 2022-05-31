import React, { FC, useState, useCallback, useEffect } from 'react';
import * as Loader from 'react-loader-spinner';
import { Input, Layout, Button, Radio, Row, Col, Card } from 'antd';
import 'antd/dist/antd.css';
import {
    GiftFilled,
    SearchOutlined,
    PercentageOutlined,
    StarFilled,
    PlusOutlined,
    ArrowUpOutlined
} from '@ant-design/icons';
import { debounce } from 'lodash';

import { Foods } from '../../Types/Foods';
import data from '../../Common/assets/foods.json';
import categories from '../../Common/assets/categories.json';

import './index.scss';

/* The following settings for the inifinte scrolling / load more items pagination */
const pageSize = 9;
const { Content } = Layout;
const foodsLength = data.foods.length;
const numberOfPages = Math.ceil(foodsLength / pageSize);
const cardStyle = { 
    borderRadius: 16, 
    boxShadow: '5px 8px 24px 5px rgba(208, 216, 243, 0.6)' 
};

const Dashboard: FC = () => {
    const [restaurantName, setRestaurantName] = useState('');
    const [currentPage, setCurrentPage] = useState(1);    
    const [showTopBtn, setShowTopBtn] = useState(false);    
    const [spinnerLoading, setSpinnerLoading] = useState(false);
    const [currentFoodItems, setCurrentFoodItems] = useState<Foods>([]);

    /* The following methods supports the item search with the debounce mechanism */
    const searchRestuarant = (name: string) => {
        const foods = data.foods.filter(e => e.restaurant.indexOf(name) > -1);
        setCurrentFoodItems(foods);
        setSpinnerLoading(false);
    };

    const onRestaurantSearch = (e:any) => {
        setSpinnerLoading(true);
        setRestaurantName(e.target.value);
        searchHandler(e.target.value);        
    };

    const searchHandler = useCallback(debounce(searchRestuarant, 2000), []);

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (e.target.value === '') {
            const foodItems = setTheDefaultPageFoodItems
            setCurrentFoodItems(foodItems);    
            setRestaurantName('');
        }
    };

    /* The following methods and the hook implementation for the inifinte scrolling / pagination */
    const setTheDefaultPageFoodItems = () => {
        const firstPageIndex = (currentPage - 1) * pageSize;
        const lastPageIndex = firstPageIndex + pageSize;
        const foodItems = data.foods.slice(firstPageIndex, lastPageIndex);    
        setCurrentPage(currentPage);
        return foodItems;
    };

    useEffect(() => {
        const foodItems = setTheDefaultPageFoodItems;
        setCurrentFoodItems(foodItems);
    }, [currentPage]);

    const loadMoreFoodItems = () => {
        setCurrentPage(prevCurrentPage => prevCurrentPage + 1);
        const firstPageIndex = (currentPage - 1) * pageSize;
        const lastPageIndex = firstPageIndex + pageSize;
        const foodItems = data.foods.slice(firstPageIndex, lastPageIndex);  
        setCurrentFoodItems(prevCurrentFoodItems => [...prevCurrentFoodItems, ...foodItems]);
    };
    
    /* The following methods and the scroll to top implementation */
    useEffect(() => {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                setShowTopBtn(true);
            } else {
                setShowTopBtn(false);
            }
        });
    }, []);

    const goToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    /* The following methods for the food items filtering according to the selected category */
    const onSelectedTheCategory = (e: any) => {
        const categoryId = e.target.value;
        if (categoryId !== 'all') {
            setCurrentFoodItems(data.foods.filter(e => e.categoryId === categoryId));
        } else {
            const foodItems = setTheDefaultPageFoodItems
            setCurrentFoodItems(foodItems);
        }        
    };

    /* The following method for the rendering process of the promotion icons */
    const renderThePromotionIcon = (promotion: any) => {
        switch(promotion) {
            case '1+1':
                return (
                    <div 
                        className='food-item-promotion-icon-wrapper'
                        style={{ backgroundColor: '#8f64ff' }}
                    >
                        <span style={{ color: '#FFFFFF' }}>1 + 1</span>
                    </div>                    
                );
            case 'gift':
                return (
                    <div 
                        className='food-item-promotion-icon-wrapper'
                        style={{ backgroundColor: '#00b1ff' }}
                    >
                        <GiftFilled style={{ fontSize: '16px', color: '#FFF' }} />
                    </div>                    
                );
            case 'discount':
                return (
                    <div 
                        className='food-item-promotion-icon-wrapper'
                        style={{ backgroundColor: '#ff696f' }}
                    >
                        <PercentageOutlined style={{ fontSize: '16px', color: '#ffffff' }} />
                    </div>
                );
        }
    };

    return (
        <>
            <Layout className='layout'>
                <Content style={{ padding: '0 50px' }}>        
                    <div className='site-layout-content'>
                        <Row>
                            <Col xs={24} xl={4} style={{ display: 'flex' }}>
                                <Input 
                                    prefix={<SearchOutlined />} 
                                    placeholder='Enter restaurant name...' 
                                    onPressEnter={onRestaurantSearch} 
                                    allowClear 
                                    style={{ borderRadius: 10, width: '100%', marginRight: 5, minWidth: 300 }}
                                    onChange={onChange}
                                />
                                {spinnerLoading && <Loader.TailSpin height={25} width={25} />} 
                            </Col>
                        </Row>
                    </div>
                    <div className='site-layout-content'>
                        <Radio.Group defaultValue='all' buttonStyle='solid' onChange={onSelectedTheCategory}>
                            <Radio.Button value='all'>All</Radio.Button>
                            {categories.map((e: any) => <Radio.Button key={e.id} value={e.id}>{e.name}</Radio.Button>)}
                        </Radio.Group>
                    </div>
                    <div className='site-layout-content'>                    
                        <Row gutter={16}>
                            {currentFoodItems.map(e => (
                                <Col key={e.id} xs={24} xl={8} sm={8} md={8}>
                                    <Card style={cardStyle}>                                        
                                        <div 
                                            className='food-items-cover-image'
                                            style={{ 
                                                backgroundImage: `url(${e.imageUrl})`,
                                                backgroundSize: 'cover',
                                                backgroundRepeat: 'no-repeat',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                borderRadius: 10
                                            }}
                                        >                                            
                                            {renderThePromotionIcon(e.promotion)}
                                        </div>
                                        <div className='food-items-name'>
                                            <span>{e.name}</span>
                                            <div>
                                                <span><StarFilled style={{ marginRight: 5 }} />{e.rating.toFixed(1)}</span>
                                                <span style={{ marginLeft: 20 }}>{e.minCookTime}-{e.maxCookTime} min</span>
                                            </div>                                            
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                    <div className='site-layout-content'>
                        {restaurantName === '' && <Button className='default-button' disabled={numberOfPages <= currentPage} onClick={loadMoreFoodItems}><PlusOutlined />Show More</Button>}
                    </div>
                </Content>
                <div className="top-to-btm">
                    {showTopBtn && <Button className='default-button-reverse' onClick={goToTop} style={{ height: 50, width: 50 }}><ArrowUpOutlined style={{ fontSize: '150%'}} /></Button>}
                </div>
            </Layout>            
        </>
    );
};

export default Dashboard;