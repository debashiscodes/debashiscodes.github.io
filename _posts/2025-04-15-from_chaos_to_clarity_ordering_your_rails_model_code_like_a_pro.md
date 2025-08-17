---
layout: post
title:  "From Chaos to Clarity: Ordering Your Rails Model Code Like a Pro"
date:   2025-04-15 11:27:41 +0530
categories: Rails
---
Ever opened a Rails model and felt overwhelmed by the messy code?

This guide will help you understand the right order to write things—like what should come first, what goes next, and how to keep it clean and easy to follow.

## Good Code Has a Flow
When you're writing code in your Rails model, it's important to follow a clear order—like this.
1. `Extends`
2. `Includes`
3. `Constants`
4. `Associations`
5. `Validations`
6. `Callback Methods`
7. `Delegations`
8. `Gem Attributes`
9. `Scopes`
10. `Class Methods`
11. `Methods`
12. `Private Methods`

```ruby
class Product
  # 1. Extends
  extend Configurable

  # 2. Includes
  include VariantParentHelper
  include VariantChildrenHelper

  # 3. Constants
  DEFAULT_PARENT_VARIANT_COUNT = 0
  DEFAULT_CHILD_VARIANT_COUNT = 0

  # 4. Associations
  has_one :parent_variant, class_name: 'Product', inverse_of: :variant_children
  has_many :variant_children, class_name: 'Product', foreign_key: :parent_variant_id, inverse_of: :parent_variant, dependent: :destroy

  # 5. Validations
  validates :sku, :name, presence: true

  # 6. Callback Methods
  before_validation :generate_sku_slug

  # 7. Delegations
  delegate :sku, :name, to: :parent_variant, prefix: true, allow_nil: true

  # 8. Gem Attributes
  has_one_attached :main_image

  # 9. Scopes
  scope :main_products, -> { where(parent_variant: nil) }
  scope :variant_products, -> { where.not(parent_variant: nil) }

  # 10. Class Methods
  def self.destroy_main_products
    Product.where(parent_variant: nil).destroy_all
  end

  # 11. Instance Methods
  def main_product?
    parent_variant.nil?
  end

  def variant_product?
    !main_product?
  end

  # 12. Private Methods
  private

  def generate_sku_slug
    self.sku = name.parameterize.underscore if name.present?
  end
end
```
A well-ordered model not only makes your life easier but also helps your teammates understand the code faster.

Start small, follow a clean structure, and your future self will thank you.
