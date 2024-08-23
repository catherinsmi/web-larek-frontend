export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {
        handleCategory(value: string) {
          switch(value) {
            case 'кнопка':
              return "card__category_button"
            case 'софт-скил':
              return "card__category_soft"
            case 'хард-скил':
                return "card__category_hard"
            case 'другое':
                return "card__category_other"
            case 'дополнительное':
                return "card__category_additional"
          }
        }
      
    
 
};
