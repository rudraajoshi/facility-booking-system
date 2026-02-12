const Facility = require('../models/Facility.model');
const Category = require('../models/Category.model');
const State = require('../models/State.model');
const City = require('../models/City.model');
const { Op } = require('sequelize');

class FacilityService {
    async getAll(queryParams = {}) {
        const { 
            search, 
            category, 
            minCapacity, 
            maxPrice, 
            status, 
            amenities,
            sortBy 
        } = queryParams;

        console.log('🔍 FacilityService.getAll called with:', queryParams);
        console.log('📊 Category value:', category, 'Type:', typeof category);

        const where = {};

        if (search && search.trim()) {
            where.facility_name = {
                [Op.like]: `%${search.trim()}%`
            };
        }

        if (minCapacity) {
            where.capacity_max = {
                [Op.gte]: parseInt(minCapacity)
            };
        }

        if (maxPrice) {
            where.price_per_hour = {
                [Op.lte]: parseFloat(maxPrice)
            };
        }

        if (status && status !== 'all') {
            where.availability_status = status.toLowerCase();
        }

        if (amenities) {
            const amenityList = amenities.split(',').map(a => a.trim());
         
            amenityList.forEach(amenity => {
                where.amenities = {
                    [Op.like]: `%${amenity}%`
                };
            });
        }

        if (category && category !== 'all') {
            const categoryId = parseInt(category);
            where.category_id = categoryId;
            console.log('✅ Adding category filter:', categoryId);
        }

        console.log('📋 Final WHERE clause:', JSON.stringify(where, null, 2));

        const include = [
            {
                model: Category,
                as: 'category', 
                attributes: ['category_id', 'category_name'],
                required: false
            },
            {
                model: State,
                as: 'state',  
                attributes: ['state_id', 'state_name'],
                required: false
            },
            {
                model: City,
                as: 'city',  
                attributes: ['city_id', 'city_name'],
                required: false
            }
        ];

     
        let order = [['facility_name', 'ASC']]; 

        if (sortBy) {
            switch (sortBy) {
                case 'name-asc':
                    order = [['facility_name', 'ASC']];
                    break;
                case 'name-desc':
                    order = [['facility_name', 'DESC']];
                    break;
                case 'price-asc':
                    order = [['price_per_hour', 'ASC']];
                    break;
                case 'price-desc':
                    order = [['price_per_hour', 'DESC']];
                    break;
                case 'rating-desc':
                    order = [['rating', 'DESC NULLS LAST']];
                    break;
                case 'capacity-desc':
                    order = [['capacity_max', 'DESC']];
                    break;
                default:
                    order = [['facility_name', 'ASC']];
            }
        }

        const facilities = await Facility.findAll({
            where,
            include,
            order
        });

        console.log('✅ Found facilities:', facilities.length);
        if (facilities.length > 0) {
            console.log('📄 First facility category_id:', facilities[0].category_id);
        }

        return facilities.map(facility => this.transformFacility(facility));
    }

    async getById(id) {
        const facility = await Facility.findByPk(id, {
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['category_id', 'category_name']
                },
                {
                    model: State,
                    as: 'state', 
                    attributes: ['state_id', 'state_name']
                },
                {
                    model: City,
                    as: 'city', 
                    attributes: ['city_id', 'city_name']
                }
            ]
        });

        if (!facility) {
            return null;
        }

        return this.transformFacility(facility);
    }

    async create(data) {
        const facility = await Facility.create(data);
        return this.transformFacility(facility);
    }

    async update(facility, data) {
        await facility.update(data);
        return this.transformFacility(facility);
    }

    async remove(facility) {
        await facility.destroy();
        return true;
    }


    transformFacility(facility) {
        const data = facility.get({ plain: true });

        return {
            id: data.facility_id.toString(),
            name: data.facility_name,
            description: data.description || '',
            location: data.building_name,
            floor: data.floor,
            

            category: data.category ? {
                category_id: data.category.category_id,
                category_name: data.category.category_name
            } : data.category_id,
            

            state: data.state ? {
                state_id: data.state.state_id,
                state_name: data.state.state_name
            } : data.state_id,
            

            city: data.city ? {
                city_id: data.city.city_id,
                city_name: data.city.city_name
            } : data.city_id,
            

            capacity: {
                min: data.capacity_min,
                max: data.capacity_max
            },

            pricing: {
                hourly: parseFloat(data.price_per_hour),
                halfDay: data.price_half_day ? parseFloat(data.price_half_day) : null,
                fullDay: data.price_full_day ? parseFloat(data.price_full_day) : null
            },

            status: this.capitalizeFirstLetter(data.availability_status),

            images: data.image_url ? [data.image_url] : [],
            

            amenities: data.amenities || [],
            

            operatingHours: data.operating_hours || { start: '08:00 AM', end: '08:00 PM' },

            rules: data.rules || [],
            

            rating: data.rating ? parseFloat(data.rating) : null,
            reviewCount: data.review_count || 0,

            createdAt: data.created_at
        };
    }

    capitalizeFirstLetter(string) {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}

module.exports = new FacilityService();