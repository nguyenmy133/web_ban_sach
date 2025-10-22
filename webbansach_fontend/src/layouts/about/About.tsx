import React, { useEffect } from "react";
import "./About.css";

function About() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="nb-about">
      {/* HERO */}
      <section className="container py-5 my-3 nb-hero rounded-2xl shadow-soft">
        <div className="row align-items-center g-4">
          <div className="col-lg-7">
            <span className="chip mb-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Về Nook Books
            </span>
            <h1 className="fw-bold nb-ink">Đọc sách là chiếc hộ chiếu cho vô số cuộc phiêu lưu ✨</h1>
            <p className="mt-3 mb-4 nb-ink-soft">
              Tại Nook Books, chúng tôi giúp bạn tìm đúng cuốn sách — đúng lúc. Từ best-seller
              đến những viên ngọc ẩn mình, tất cả đều được chọn lọc cẩn thận với trải nghiệm
              mua sắm mượt mà.
            </p>

            <div className="d-flex gap-2">
              <button className="cta-btn">Khám phá sách ngay</button>
              <a className="link-soft d-flex align-items-center" href="#">
                Xem tuyển tập mới →
              </a>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="stat d-flex justify-content-between align-items-center mb-3">
              <div>
                <h3 className="nb-primary-text">50.000+</h3>
                <small className="text-muted">đầu sách đã phục vụ</small>
              </div>
              <img src="/book-open-text.svg" width="44" height="44" alt="Nook icon" />
            </div>
            <div className="stat d-flex justify-content-between align-items-center">
              <div>
                <h3 className="nb-primary-text">4.9/5.0</h3>
                <small className="text-muted">mức độ hài lòng của độc giả</small>
              </div>
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27Z"
                      stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="container py-4">
        <div className="row g-4 align-items-center">
          <div className="col-lg-6">
            <div className="nb-card p-4">
              <h2 className="fw-bold mb-3 nb-ink">Câu chuyện của chúng tôi</h2>
              <p className="nb-ink-soft">
                Nook Books bắt đầu từ một “góc nhỏ” của những người mê sách. Chúng tôi tin rằng đọc
                không chỉ là tiêu khiển, mà là cách để lớn lên mỗi ngày. Vì thế, Nook chú trọng 3 điều:
                tuyển chọn cẩn thận, gợi ý thông minh theo sở thích, và dịch vụ chu đáo từ giỏ hàng đến tay bạn.
              </p>
              <ul className="mt-3 nb-ink-soft">
                <li>Gợi ý cá nhân hóa theo thể loại bạn yêu</li>
                <li>Kho bìa đẹp, bản in chuẩn, nhiều phiên bản độc quyền</li>
                <li>Giao nhanh, đóng gói “nâng niu” từng cuốn</li>
              </ul>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="rounded-2xl overflow-hidden shadow-soft nb-img-frame">
              <img
                src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop"
                alt="Nook Books workspace"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-5 nb-section-alt">
        <div className="container">
          <h2 className="fw-bold text-center mb-4 nb-ink">Chúng tôi trân trọng điều gì?</h2>
          <div className="row g-3">
            <div className="col-md-4">
              <div className="value-card h-100">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="chip">Tận tâm</span>
                </div>
                <p className="mb-0 nb-ink-soft">
                  Từ khâu chọn sách đến đóng gói — mọi chi tiết đều vì trải nghiệm của bạn.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="value-card h-100">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="chip">Minh bạch</span>
                </div>
                <p className="mb-0 nb-ink-soft">
                  Giá rõ ràng, nguồn gốc chuẩn. Chúng tôi chỉ bán những gì chính mình mê đọc.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="value-card h-100">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="chip">Bền vững</span>
                </div>
                <p className="mb-0 nb-ink-soft">
                  Bao bì thân thiện & tối ưu vận chuyển để giảm lãng phí.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ + CTA */}
      <section className="container py-5">
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="p-4 rounded-2xl shadow-soft bg-white">
              <h3 className="fw-bold mb-3 nb-ink">Câu hỏi thường gặp</h3>
              <details className="mb-2">
                <summary className="fw-semibold">Thời gian giao hàng?</summary>
                <div className="mt-2 text-muted">Nội thành 1–2 ngày, liên tỉnh 2–5 ngày tùy khu vực.</div>
              </details>
              <details className="mb-2">
                <summary className="fw-semibold">Đổi trả thế nào?</summary>
                <div className="mt-2 text-muted">Miễn phí trong 7 ngày nếu lỗi in/rách/nhầm hàng.</div>
              </details>
              <details>
                <summary className="fw-semibold">Có gợi ý theo sở thích không?</summary>
                <div className="mt-2 text-muted">Có — bạn nhập vài từ khóa, Nook sẽ đề xuất ngay.</div>
              </details>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="p-4 rounded-2xl shadow-soft nb-cta">
              <h3 className="fw-bold nb-ink">Bạn sẵn sàng cho cuốn tiếp theo?</h3>
              <p className="mb-3 nb-ink-soft">Tìm theo chủ đề, tác giả, hay ISBN — Nook có cả.</p>
              <div>
                <a className="btn cta-btn me-2" href="#">Khám phá danh mục</a>
                <a className="link-soft" href="#">Liên hệ hỗ trợ →</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
